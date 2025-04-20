const { response, request } = require('express');
const { createLogger, format, transports } = require("winston");
const Stock = require('../models/Stock');



const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // More readable timestamp
        format.errors({ stack: true }), // Log stack trace for errors
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'stock-controller' }, // Add context to logs
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add colors for readability in console
                format.simple() // Use simple format for console
            )
        })
    ],
});

const stockGet = async (req = request, res = response) => {
    try {
        const { productCode } = req.query;
        const query = {
            quantity: { $gt: 0 }, // Filter: quantity greater than 0
        };
        const sortOptions = { createdAt: -1 }; // Sort by createdAt descending (newest first)
        if (productCode) {
            query.productId = productCode; // Assuming 'productId' is the field in StockSchema that relates to product code
            logger.info(`Stock query: Filtering by productId=${productCode}, excluding zero quantity, sorting by createdAt desc`, { productCode });
        } else {
            logger.info(`Stock query: Retrieving all available stock (quantity > 0), sorting by createdAt desc`);
        }
        const stockEntries = await Stock.find(query).sort(sortOptions);
        logger.info(`Stock query successful. Records found: ${stockEntries.length}`, { totalCount: stockEntries.length });
        res.status(200).json(stockEntries);
    } catch (error) {
        logger.error(`Error retrieving stock entries: ${error.message}`, { error });
        res.status(500).json({ msg: 'Error retrieving stock entries. Please contact administrator.' });
    }
};

/**
 * Get a single stock entry by its MongoDB ID.
 */
const stockGetById = async (req = request, res = response) => {
    const { id } = req.params;
    logger.info(`Stock Get By ID API: Request for ID [${id}]`);

    try {
        const stockEntry = await Stock.findById(id);
        // Optional: Populate product details if needed
        // .populate({ path: 'productId', select: 'title code' });

        if (!stockEntry) {
            logger.warn(`Stock Get By ID API: Stock entry not found - ID [${id}]`);
            return res.status(404).json({ msg: `Stock entry with ID ${id} not found.` });
        }

        logger.info(`Stock Get By ID API: Stock entry found - ID [${id}]`);
        return res.status(200).json(stockEntry);

    } catch (error) {
        // Handle potential CastError if ID format is invalid (though validator should catch this)
        if (error.name === 'CastError') {
            logger.warn(`Stock Get By ID API: Invalid ID format - ID [${id}]`);
            return res.status(400).json({ msg: `Invalid stock entry ID format: ${id}` });
        }
        logger.error(`Stock Get By ID API - Error fetching stock entry ID [${id}]: ${error.message}`, error);
        return res.status(500).json({
            msg: 'Error fetching stock entry. Please contact administrator.',
        });
    }
};


/**
 * Create a new stock entry.
 */
const stockPost = async (req = request, res = response) => {
    // Extract required fields from body (validation should happen in middleware)
    const { productCode, quantity, expirationDate, costPrice, campaign, location, batchNumber, notes } = req.body;
    logger.info(`Stock Post API: Request received for productCode [${productCode}]`);

    try {
        // Optional: Check if productCode exists in Product collection before creating stock

        // Create new stock instance
        const stockEntry = new Stock({
            productCode,
            quantity,
            expirationDate, // Ensure this is a valid Date object (validator helps)
            costPrice,
            campaign, // Optional
            location, // Optional
            batchNumber, // Optional
            notes // Optional
        });

        // Save to database
        const savedStockEntry = await stockEntry.save();

        logger.info(`Stock Post API - Stock entry created: ${savedStockEntry._id} for productCode [${productCode}]`);
        return res.status(201).json(savedStockEntry); // 201 Created

    } catch (error) {
        // Handle potential duplicate key errors if productCode + batchNumber needs to be unique, etc.
        if (error.code === 11000) { // Duplicate key error
            logger.error(`Stock Post API - Error: Duplicate key violation.`, error);
            return res.status(400).json({
                msg: 'Error creating stock entry: Possible duplicate detected (e.g., unique batch number constraint).',
                error: error.keyValue // Shows which field caused the duplication
            });
        }
        logger.error(`Stock Post API - Error creating stock entry for productCode [${productCode}]: ${error.message}`, error);
        return res.status(500).json({
            msg: 'Error creating stock entry. Please contact administrator.',
        });
    }
};

/**
 * Update an existing stock entry by ID.
 */
const stockPut = async (req = request, res = response) => {
    const { id } = req.params;
    // Get only the fields allowed to be updated from the body
    const { quantity, expirationDate, costPrice, campaign, location, batchNumber, notes } = req.body;
    logger.info(`Stock Put API: Request received for ID [${id}]`);

    // Build update object with only the provided fields
    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (expirationDate !== undefined) updateData.expirationDate = expirationDate;
    if (costPrice !== undefined) updateData.costPrice = costPrice;
    if (campaign !== undefined) updateData.campaign = campaign;
    if (location !== undefined) updateData.location = location;
    if (batchNumber !== undefined) updateData.batchNumber = batchNumber;
    if (notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
        logger.warn(`Stock Put API: No update data provided for ID [${id}]`);
        return res.status(400).json({ msg: 'No fields provided for update.' });
    }

    try {
        // Find by ID and update, return the updated document
        const updatedStockEntry = await Stock.findByIdAndUpdate(id, updateData, {
            new: true, // Return the modified document
            runValidators: true // Ensure updates adhere to schema validation
        });

        if (!updatedStockEntry) {
            logger.warn(`Stock Put API: Stock entry not found for update - ID [${id}]`);
            return res.status(404).json({ msg: `Stock entry with ID ${id} not found.` });
        }

        logger.info(`Stock Put API - Stock entry updated: ${updatedStockEntry._id}`);
        return res.status(200).json(updatedStockEntry);

    } catch (error) {
        // Handle potential CastError if ID format is invalid
        if (error.name === 'CastError') {
            logger.warn(`Stock Put API: Invalid ID format - ID [${id}]`);
            return res.status(400).json({ msg: `Invalid stock entry ID format: ${id}` });
        }
        // Handle validation errors during update
        if (error.name === 'ValidationError') {
            logger.error(`Stock Put API - Validation Error updating ID [${id}]: ${error.message}`, error);
            return res.status(400).json({ msg: 'Validation failed during update.', errors: error.errors });
        }
        // Handle potential duplicate key errors if updating unique fields like batchNumber
        if (error.code === 11000) {
            logger.error(`Stock Put API - Error: Duplicate key violation during update for ID [${id}].`, error);
            return res.status(400).json({
                msg: 'Error updating stock entry: Possible duplicate detected.',
                error: error.keyValue
            });
        }
        logger.error(`Stock Put API - Error updating stock entry ID [${id}]: ${error.message}`, error);
        return res.status(500).json({
            msg: 'Error updating stock entry. Please contact administrator.',
        });
    }
};

/**
 * Delete a stock entry by ID.
 * Consider if a soft delete (marking inactive) is more appropriate for stock history.
 */
const stockDelete = async (req = request, res = response) => {
    const { id } = req.params;
    logger.info(`Stock Delete API: Request received for ID [${id}]`);

    try {
        // Option 1: Permanent Delete
        const deletedStockEntry = await Stock.findByIdAndDelete(id);

        // Option 2: Soft Delete (Requires an 'isActive' field in the Stock schema)
        // const deletedStockEntry = await Stock.findByIdAndUpdate(id, { isActive: false }, { new: true });

        if (!deletedStockEntry) {
            logger.warn(`Stock Delete API: Stock entry not found for deletion - ID [${id}]`);
            return res.status(404).json({ msg: `Stock entry with ID ${id} not found.` });
        }

        logger.info(`Stock Delete API - Stock entry deleted (or marked inactive): ${deletedStockEntry._id}`);
        // Send back the deleted/updated entry or just a success message
        return res.status(200).json({ msg: 'Stock entry deleted successfully.', entry: deletedStockEntry });
        // return res.status(204).send(); // 204 No Content is also common for DELETE

    } catch (error) {
        // Handle potential CastError if ID format is invalid
        if (error.name === 'CastError') {
            logger.warn(`Stock Delete API: Invalid ID format - ID [${id}]`);
            return res.status(400).json({ msg: `Invalid stock entry ID format: ${id}` });
        }
        logger.error(`Stock Delete API - Error deleting stock entry ID [${id}]: ${error.message}`, error);
        return res.status(500).json({
            msg: 'Error deleting stock entry. Please contact administrator.',
        });
    }
};


module.exports = {
    stockGet,
    stockGetById,
    stockPost,
    stockPut,
    stockDelete,
};