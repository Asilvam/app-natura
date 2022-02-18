const {Schema, model} = require("mongoose");

const productoSchema = new Schema({
        title: {type: String},
        price: {type: Number},
        inStock: {type: Number},
        code: {type: String},
        cicle: {type: []},
        expiration: {type: []},
        description: {type: String},
        path: {type: String},
        isActive: {type: Boolean, default: true},
        category: {type: String}
    },
    {
        timestamps: true
    });

module.exports = model("Producto", productoSchema);