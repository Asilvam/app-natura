const {Schema, model} = require("mongoose");

const productoSchema = new Schema({
        title: {type: String},
        price: {type: Number},
        stock: {type: Number},
        code: {type: String},
        cicle: {type: String},
        expiration: {type: String},
        description: {type: String},
        path: {type: String},
        isActive: {type: Boolean, default: true},
        category: {type: String}
    },
    {
        timestamps: true
    });

module.exports = model("Producto", productoSchema);