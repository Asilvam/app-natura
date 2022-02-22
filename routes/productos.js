const {Router} = require('express');

const {
    productosGet,
    productosPut,
    productosPost,
    productosDelete
} = require('../controllers/productos');
const {validateFileUp} = require("../middlewares/validate-file");
const {validateExtensionFile} = require("../middlewares/validate-extensionFile");
const router = Router();

router.get('/', productosGet);

router.put('/:id', productosPut);

router.post('/', [
    validateFileUp,
    validateExtensionFile,
], productosPost);

router.delete('/', productosDelete);

module.exports = router;