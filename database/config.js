const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        });
        console.log('DB online')
    } catch (e) {
        console.log(e);
        throw new Error('Error to starting DB');
    }
}

module.exports = {
    dbConnection
}