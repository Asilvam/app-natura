const mongoose = require('mongoose');
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // More readable timestamp
        format.errors({ stack: true }), // Log stack trace for errors
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'database-connection' }, // Add context to logs
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add colors for readability in console
                format.simple() // Use simple format for console
            )
        })
    ],
});

const dbConnection = async () => {
    const mongoUri = process.env.MONGODB_CNN;
    if (!mongoUri) {
        logger.error('MongoDB connection string (MONGODB_CNN) is not defined in environment variables.');
        throw new Error('Database configuration error: MONGODB_CNN is missing.');
    }
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(mongoUri);
        logger.info('Database connection established successfully.');
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error after initial connection:', err);
        });
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB connection lost.');
        });
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB connection re-established.');
        });

    } catch (error) {
        logger.error(`Error connecting to the database: ${error.message}`, { stack: error.stack });
        throw new Error(`Failed to establish initial database connection: ${error.message}`);
    }
};

module.exports = {
    dbConnection
};