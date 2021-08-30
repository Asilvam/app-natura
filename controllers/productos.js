const {response, request} = require('express');

const Usuario = require('../models/producto');

const productosGet = (req = request, res = response) => {
    const {q, nombre = 'No name', apikey, page = 1, limit} = req.query;
    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const productosPost = async (req, res = response) => {
    const body = req.body;
    const usuario = new Usuario(body);

    await usuario.save();
    res.json({
        msg: 'post API - productosPost',
        body
    });
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