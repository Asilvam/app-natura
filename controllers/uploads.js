const {response} = require("express");
const {upFile} = require("../helpers/up-file");
const Product = require('../models/product');
const User = require('../models/user');
const path = require("path");
const fs = require("fs");

const {v2: cloudinary} = require("cloudinary");

const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Readable timestamp
        format.errors({ stack: true }), // Log stack trace for errors
        format.splat(),
        format.json() // Default underlying format
    ),
    defaultMeta: { service: 'uploads-controller' }, // Context for this controller
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add colors for readability in console
                format.printf(({ timestamp, level, message, service, stack }) => {
                    const servicePart = service ? `[${service}] ` : '';
                    return `${timestamp} ${level}: ${servicePart}${stack || message}`;
                })
            ),
        })
    ],
    exitOnError: false, // Prevent exit on handled exceptions
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Optional: Enforce HTTPS URLs (recommended)
});

const loadFile = async (req, res = response) => {
    logger.info('LoadFile API: Received request to upload file locally.');
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        logger.warn('LoadFile API: No file was provided in the request.');
        return res.status(400).json({ msg: 'No file was uploaded.' });
    }
    try {
        const name = await upFile(req.files, undefined, 'imgs');
        logger.info(`LoadFile API: File successfully uploaded locally as: ${name}`);
        res.status(201).json({ name });
    } catch (error) { // Catch the actual error object
        const errorMessage = error?.message || (typeof error === 'string' ? error : 'Unknown error during local file upload.');
        logger.error(`LoadFile API Error: ${errorMessage}`, { stack: error?.stack }); // Log stack if available
        res.status(400).json({ msg: errorMessage });
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