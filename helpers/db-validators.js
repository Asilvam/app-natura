const user = require('../models/user');

const existMail = async (email = '') => {
    const exist = await user.findOne({email});
    if (exist) {
        throw new Error(`email ${email} exist!`)
    }
}

const existCategory = async (id) => {
    const exist = await Categoria.findById(id);
    if (!exist) {
        throw new Error(`id don't exist!  ${id}`);
    }
}

const existUser = async (id) => {
    const exist = await user.findById(id);
    if (!exist) {
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
    existMail,
    existUser,
    existCategory,
    collectionsAllows,
}