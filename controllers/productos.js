const {response, request} = require('express');

const Producto = require('../models/producto');
const {v2: cloudinary} = require("cloudinary");

const productosGet = async (req = request, res = response) => {
    const {pageNumber, nPerPage} = req.query;
    const total = await Producto.countDocuments({isActive: true});
    const products = await Producto.find({isActive: true})
        .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
        .limit(nPerPage)
    res.json({
        total,
        products
    });
}

const productosPost = async (req, res = response) => {
    const body = req.body;
    const {tempFilePath} = req.files.file
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    const producto = new Producto(body);
    producto.path = secure_url;
    const result = await producto.save();
    if (result) {
        // console.log('result-->', result._doc);
        res.status(201);
        res.json({
            msg: 'Post API - Producto',
            result
        });
    }
}

const productosPut = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg: 'put API - productosPut',
        id
    });
}

const productosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - productosPatch'
    });
}

const productosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - productosDelete'
    });
}

module.exports = {
    productosGet,
    productosPost,
    productosPut,
    productosPatch,
    productosDelete,
}