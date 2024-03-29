const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {createLogger, format, transports} = require("winston");
const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console({})],
});

const usersGet = async (req = request, res = response) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const users = await User.paginate({limit, page});
    logger.info(users);
    res.json(
        users
    );
}

const usersPost = async (req, res = response) => {
    const {name, email, password} = req.body;
    const user = new User({name, email, password});
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    const result = await user.save();
    if (result) {
        res.status(201);
        res.json({
            msg: 'Post API - User',
            result
        });
    }
}

const usersPut = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg: 'put API - usersPut',
        id
    });
}

const usersDelete = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg: 'delete API - usersDelete',
        id
    });
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
}