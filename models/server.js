const express = require('express');
const cors = require('cors');
const {dbConnection} = require("../database/config");
const fileUpload = require('express-fileupload');
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // More readable timestamp
        format.errors({ stack: true }), // Log stack trace for errors
        format.splat(),
        format.json() // Default underlying format
    ),
    defaultMeta: { service: 'application-server' }, // Context for server logs
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

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.stockPath = '/api/stock';
        this.usuariosPath = '/api/users';
        this.productosPath = '/api/products';
        this.uploadPath = '/api/uploads';
        this.authPath = '/api/auth';
        this.connectDB();
        this.middlewares();
        this.routes();
    }


    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.stockPath, require('../routes/stock'));
        this.app.use(this.usuariosPath, require('../routes/users'));
        this.app.use(this.productosPath, require('../routes/products'));
        this.app.use(this.uploadPath, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => {
            logger.info(`Server run in port ${this.port}`);
        });
    }
}

module.exports = Server;
