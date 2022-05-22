const {response, request} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const users = await Usuario.paginate({limit, page})
    res.json(
        users
    );
}

const usuariosPost = async (req, res = response) => {
    const {name, email, password} = req.body;
    const usuario = new Usuario({name, email, password});
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();
    res.json({
        usuario
    });
}

const usuariosPut = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}

const usuariosDelete = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg: 'delete API - usuariosDelete',
        id
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}