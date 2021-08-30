const {Schema, model} = require("mongoose");

const productoSchema = new Schema({
        title: {type: String},
        precio: {type: Number},
        cantidad: {type: Number},
        codigo: {type: String},
        ciclo: {type: String},
        description: {type: String},
        filename: {type: String},
        path: {type: String},
        estado: {type: Boolean, default: true},
        categoria: {type: String}
    },
    {
        timestamps: true
    });

module.exports = model("Producto", productoSchema);