const {Router} = require('express');
const {check} = require("express-validator");
const {validarCampos} = require("../middlewares/validar-campos");
const {existeCorreo} = require("../helpers/db-validators");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);
router.put('/:id', usuariosPut);
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeCorreo),
    check('password', 'El password debe de ser más de 6 caracteres').isLength({min: 6}),
    validarCampos
], usuariosPost);
router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;