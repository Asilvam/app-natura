const {Router} = require('express');

const {
    productosGet,
    productosPut,
    productosPost,
    productosDelete,
    productosPatch
} = require('../controllers/productos');
const {validateFileUp} = require("../middlewares/validate-file");

const router = Router();

router.get('/', productosGet);
router.put('/:id', productosPut);
router.post('/', validateFileUp, productosPost);
router.delete('/', productosDelete);
router.patch('/', productosPatch);

module.exports = router;