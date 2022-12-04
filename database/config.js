const mongoose = require('mongoose');
const {createLogger, format, transports} = require("winston");
const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console({})],
});

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('DataBase online')
    } catch (e) {
        logger.error(e);
        throw new Error('Error to starting DB');
    }
}

module.exports = {
    dbConnection
}