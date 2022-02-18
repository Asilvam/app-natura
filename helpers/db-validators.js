const usuario = require('../models/usuario');

const existeCorreo = async (correo = '') => {
    const existe = await usuario.findOne({correo});
    if (existe) {
        throw new Error(`El correo ${correo} ya existe`)
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}
/**
 * Validar colecciones permitidas
 */
const collectionsAllows = (collection = '', collections = []) => {
    const include = collections.includes(collection);
    if (!include) {
        throw new Error(`the collection ${collection} is not allow, ${collections}`);
    }
    return true;
}

module.exports = {
    existeCorreo,
    existeUsuarioPorId,
    collectionsAllows
}