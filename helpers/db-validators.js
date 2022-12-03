const user = require('../models/user');
const category = require('../models/category');


const existMail = async (email = '') => {
    const exist = await user.findOne({email});
    if (exist) {
        throw new Error(`email ${email} exist!`)
    }
}

const existCategory = async (id) => {
    const exist = await category.findById(id);
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