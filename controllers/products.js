const {response, request} = require('express');
const Product = require('../models/product');
const {v2: cloudinary} = require("cloudinary");

const productsGet = async (req = request, res = response) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const products = await Product.paginate({isActive: true}, {limit, page});
    res.json(products);
}

const productsPost = async (req = request, res = response) => {
    const body = req.body;
    // console.log(body);
    const {tempFilePath} = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    const product = new Product(body);
    product.path = secure_url;
    const result = await product.save();
    if (result) {
        res.status(201);
        res.json({
            msg: 'Post API - Product',
            result
        });
    }
}

const productsPut = async (req = request, res = response) => {
    const {id} = req.params;
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
    res.json(updateProduct);
}

const productsDelete = async (req = request, res = response) => {
    const {id} = req.params;
    const deleteProduct = await Product.findByIdAndUpdate(id, {isActive: false}, {new: true});
    res.json(deleteProduct);
}

module.exports = {
    productsGet,
    productsPost,
    productsPut,
    productsDelete,
}