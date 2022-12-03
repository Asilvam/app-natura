const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
        title: {type: String},
        price: {type: Number},
        inStock: {type: Number},
        code: {type: String},
        cycle: {type: [String]},
        expiration: {type: [String]},
        description: {type: String},
        path: {type: String},
        isActive: {type: Boolean, default: true},
        category: {type: String},
        isOnSale:{type: Boolean, default: false},
    },
    {
        timestamps: true
    });

productSchema.plugin(mongoosePaginate);

module.exports = model("Product", productSchema);