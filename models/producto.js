const {Schema, model} = require("mongoose");
const mongoosePaginate= require('mongoose-paginate-v2');

const productoSchema = new Schema({
        title: {type: String},
        price: {type: Number},
        inStock: {type: Number},
        code: {type: String},
        cycle: {type: []},
        expiration: {type: []},
        description: {type: String},
        path: {type: String},
        isActive: {type: Boolean, default: true},
        category: {type: String}
    },
    {
        timestamps: true
    });

productoSchema.plugin(mongoosePaginate);

module.exports = model("Producto", productoSchema);