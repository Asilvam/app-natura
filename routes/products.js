const {Router} = require('express');

const {productsGet, productsPut, productsPost, productsDelete} = require('../controllers/products');
const {validateFileUp} = require("../middlewares/validate-file");
const {validateExtensionFile} = require("../middlewares/validate-extensionFile");
const router = Router();

router.get('/', productsGet);

router.get('/:id', productsGet);

router.post('/', [
    validateFileUp,
    validateExtensionFile,
], productsPost);

router.put('/:id', productsPut);

router.delete('/:id', productsDelete);

module.exports = router;