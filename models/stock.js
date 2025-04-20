const { Schema, model} = require("mongoose");

const StockSchema = new Schema({
    productCode: { type: String },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    campaign: { type: String, trim: true },
    expirationDate: { type: Date },
    status: { type: String, enum: ['available', 'sold', 'reserved', 'expired', 'damaged'], default: 'available' },
    addedAt: { type: Date, default: Date.now },
    costPrice: { type: Number, min: 0, required: true },
}, { timestamps: true });

const StockModel = model("Stock", StockSchema);

module.exports = StockModel;