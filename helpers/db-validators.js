const usuario = require('../models/usuario');

const existeCorreo = async (email = '') => {
    const existe = await usuario.findOne({email});
    if (existe) {
        throw new Error(`email ${email} exist!`)
    }
}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`id don't exist!  ${id}`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`id don't exist!  ${id}`);
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
    existeCategoriaPorId,
    collectionsAllows,
}