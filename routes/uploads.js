const {Router} = require('express');
const {loadFile, updateImageCloudinary, showImage} = require('../controllers/uploads');
const {validateFileUp} = require("../middlewares/validate-file");
const {validateFields} = require("../middlewares/validate-fields");
const {check} = require("express-validator");
const {collectionsAllows} = require("../helpers/db-validators");
const router = Router();

router.post('/', validateFileUp, loadFile);

router.put('/:collection/:id', [
    validateFileUp,
    check('id', 'id must be Mongodb').isMongoId(),
    check('collection').custom(c => collectionsAllows(c, ['usuarios', 'productos'])),
    validateFields,
], updateImageCloudinary)

router.get('/:collection/:id', [
    check('id', 'id must be Mongodb').isMongoId(),
    check('collection').custom(c => collectionsAllows(c, ['usuarios', 'productos'])),
    validateFields,
], showImage)

module.exports = router;