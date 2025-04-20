const {response, request} = require('express');
const Product = require('../models/product');
const {v2: cloudinary} = require("cloudinary");

const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // More readable timestamp
        format.errors({ stack: true }), // Log stack trace for errors
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'products-controller' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add colors for readability in console
                format.printf(({ timestamp, level, message, service, stack }) => {
                    const servicePart = service ? `[${service}] ` : '';
                    return `${timestamp} ${level}: ${servicePart}${stack || message}`;
                })
            )
        })
    ],
    exitOnError: false, // Prevent exit on handled exceptions
});

const productsGet = async (req = request, res = response) => {
    let limit = parseInt(req.query.limit, 10); // Explicitly parse to integer (base 10)
    let page = parseInt(req.query.page, 10);
    if (isNaN(limit) || limit <= 0) {
        limit = 10; // Default limit
    }
    if (isNaN(page) || page <= 0) {
        page = 1; // Default page
    }
    try {
        const query = { isActive: true }; // Filter for active products
        const options = {
            limit,
            page,
        };
        const productsResult = await Product.paginate(query, options);
        logger.info(`Get API - Products fetched: Page ${page}, Limit ${limit}, Total Docs: ${productsResult.totalDocs}`);
        return res.status(200).json(productsResult);
    } catch (error) {
        logger.error(`Get API - Products Error fetching page ${page}, limit ${limit}: ${error.message}`, error);
        return res.status(500).json({
            msg: 'Error fetching products. Please contact administrator.',
        });
    }
};

const productsPost = async (req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        logger.warn('Post API - Products: No file uploaded'); // Log a warning
        return res.status(400).json({ msg: 'No file was uploaded.' });
    }
    const { tempFilePath } = req.files.file;
    const productData = req.body; // Keep product data separate initially
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'products' // Optional: Organize uploads in Cloudinary
        });
        const product = new Product({
            ...productData, // Spread the data from the request body
            path: secure_url, // Assign the Cloudinary URL
            // Consider adding public_id if you need to delete images later
            // cloudinary_public_id: public_id
        });
        const savedProduct = await product.save();
        logger.info(`Post API - Product created: ${savedProduct._id}`);
        return res.status(201).json(savedProduct);

    } catch (error) {
        logger.error(`Post API - Products Error: ${error.message}`, error);
        return res.status(500).json({
            msg: 'Error creating product. Please contact administrator.',
        });
    }
};

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
    productsGet, productsPost, productsPut, productsDelete,
}