const usuario = require('../models/usuario');

const existeCorreo = async (correo = '') => {
    const existe = await usuario.findOne({correo});
    if (existe) {
        throw new Error(`El correo ${correo} ya existe`)
    }
}

const existeUsuarioPorId = async (id) => {

    // Verificar si el correo existe
    const existeUsuario = await usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

module.exports = {
    existeCorreo,
    existeUsuarioPorId
}