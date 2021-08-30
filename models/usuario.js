const {Schema, model} = require("mongoose");

const UsuarioSchema = new Schema({
        nombre: {
            type: String,
            required: [true, 'Nombre es obligatorio']
        },
        correo: {
            type: String,
            required: true,
            unique: [true, 'Correo es obligatorio']
        },
        password: {
            type: String,
            required: [true, 'Password es obligatorio']
        },
        img: {
            type: String
        },
        estado: {
            type: Boolean,
            default: true
        },
        createdByGoogle: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    });

UsuarioSchema.methods.toJSON = function () {
    const {__v, password, ...usuario} = this.toObject();
    return usuario
}

module.exports = model('Usuario', UsuarioSchema);