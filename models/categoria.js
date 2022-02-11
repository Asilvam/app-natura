const {Schema, model} = require("mongoose");

const categoriaSchema = new Schema(
    {
        name: {type: String, required: true, trim: true},
        isActive: {type: Boolean, default: true},
        code: {type: String, required: true, unique: true, trim: true}
    },
    {
        timestamps: true
    }
);

module.exports = model("Categoria", categoriaSchema);