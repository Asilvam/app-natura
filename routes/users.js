const {Router} = require('express');
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validate-fields");
const {existMail} = require("../helpers/db-validators");
const {usersGet, usersPut, usersPost, usersDelete,} = require('../controllers/users');
const {validateJwt} = require("../middlewares/validate-jwt");

const router = Router();

router.get('/', usersGet);
router.put('/:id', usersPut);
router.post('/', [
    check('name', 'name is require').not().isEmpty(),
    check('email', 'email is not valid').isEmail(),
    check('email').custom(existMail),
    check('password', 'pass must be 6 characters at least').isLength({min: 6}),
    validateFields
], usersPost);
router.delete('/:id', [validateJwt], usersDelete);

module.exports = router;