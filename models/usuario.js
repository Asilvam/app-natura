const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const usuarioSchema = new Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        img: {type: String},
        isActive: {type: Boolean, default: true},
        createdByGoogle: {type: Boolean, default: false}
    },
    {
        timestamps: true
    });

usuarioSchema.plugin(mongoosePaginate);

usuarioSchema.methods.toJSON = function () {
    const {__v, password, ...usuario} = this.toObject();
    return usuario
}

module.exports = model('Usuario', usuarioSchema);