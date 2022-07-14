const {response} = require("express");
const {upFile} = require("../helpers/up-file");
const Product = require('../models/product');
const User = require('../models/user');
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const loadFile = async (req, res = response) => {
    try {
        const name = await upFile(req.files, undefined, 'imgs');
        res.json({name});
    } catch (msg) {
        res.status(400).json({msg});
    }
}

const updateImageCloudinary = async (req, res = response) => {
    const {id, collection} = req.params;
    let model;
    switch (collection) {
        case 'usuarios':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `User with id ${id} not found!`
                });
            }
            break;
        case 'productos':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Product with id ${id} not found!`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }
    // Limpiar imágenes previas
    if (model.path) {
        const nameArr = model.path.split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');
        await cloudinary.uploader.destroy(public_id);
    }
    const {tempFilePath} = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    model.path = secure_url;
    await model.save();
    res.json(model);
}

const showImage = async (req, res = response) => {
    const {id, collection} = req.params;
    let model;
    switch (collection) {
        case 'usuarios':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }
    // Limpiar imágenes previas
    if (model.path) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.path);
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage)
        }
    }
    const pathImage = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImage);
}

module.exports = {
    loadFile,
    updateImageCloudinary,
    showImage,
}