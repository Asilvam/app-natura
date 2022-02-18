const {Schema, model} = require("mongoose");

const categoriaSchema = new Schema(
    {
        name: {type: String, required: [true, 'name is required!'], trim: true, unique: true},
        isActive: {type: Boolean, default: true},
        code: {type: String, required: true, unique: true, trim: true}
    },
    {
        timestamps: true
    }
);

module.exports = model("Categoria", categoriaSchema);