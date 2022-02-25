const {response, request} = require('express');

const Producto = require('../models/producto');
const {v2: cloudinary} = require("cloudinary");

const productosGet = async (req = request, res = response) => {
    const {pageNumber, nPerPage} = req.query;
    const total = await Producto.countDocuments({isActive: true});
    const products = await Producto.find({isActive: true})
        .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
        .limit(nPerPage)
    res.json(
        products
    );
}

const productosPost = async (req = request, res = response) => {
    const body = req.body;
    const {tempFilePath} = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    const producto = new Producto(body);
    producto.path = secure_url;
    const result = await producto.save();
    if (result) {
        res.status(201);
        res.json({
            msg: 'Post API - Producto',
            result
        });
    }
}

const productosPut = async (req = request, res = response) => {
    const {id} = req.params;
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, {new: true});
    res.json(productoActualizado);
}


const productosDelete = async (req = request, res = response) => {
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {isActive: false}, {new: true});

    res.json(productoBorrado);
}

module.exports = {
    productosGet,
    productosPost,
    productosPut,
    productosDelete,
}