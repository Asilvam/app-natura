const {response, request} = require('express');

const Producto = require('../models/producto');

const productosGet = async (req = request, res = response) => {
    // const {q, nombre = 'No name', apikey, page = 1, limit} = req.query;
    const productos = await Producto.find();
    res.json({
        productos
    });
}

const productosPost = async (req, res = response) => {

    const body = req.body;
    const producto = new Producto(body);
    const result = await producto.save();
    if (result) {
        console.log('result-->', result);
        res.status(201);
        res.json({
            msg: 'Post API - Producto'
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