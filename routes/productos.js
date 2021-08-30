const {Router} = require('express');

const {
    productosGet,
    productosPut,
    productosPost,
    productosDelete,
    productosPatch
} = require('../controllers/productos');

const router = Router();

router.get('/', productosGet);
router.put('/:id', productosPut);
router.post('/', productosPost);
router.delete('/', productosDelete);
router.patch('/', productosPatch);

module.exports = router;