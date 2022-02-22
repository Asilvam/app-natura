const {Router} = require('express');
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validate-fields");
const {existeCorreo} = require("../helpers/db-validators");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);
router.put('/:id', usuariosPut);
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeCorreo),
    check('password', 'El password debe de ser más de 6 caracteres').isLength({min: 6}),
    validateFields
], usuariosPost);
router.delete('/', usuariosDelete);

module.exports = router;