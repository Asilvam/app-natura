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
const {validateJwt} = require("../middlewares/validate-jwt");

const router = Router();

router.get('/', usuariosGet);
router.put('/:id', usuariosPut);
router.post('/', [
    check('name', 'name is require').not().isEmpty(),
    check('email', 'email is not valid').isEmail(),
    check('email').custom(existeCorreo),
    check('password', 'pass must be 6 characters at least').isLength({min: 6}),
    validateFields
], usuariosPost);
router.delete('/:id', [validateJwt], usuariosDelete);

module.exports = router;