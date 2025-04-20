const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema(
    {
        productCode: { type: String, required: true, unique: true, trim: true },
        title: { type: String, required: true, minlength: 3, maxlength: 255, trim: true },
        description: { type: String, trim: true },
        salePrice: { type: Number, required: true, min: 0 },
        path: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
        stock: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

productSchema.plugin(mongoosePaginate);

const ProductModel = model("Product", productSchema);

module.exports = ProductModel;