const {Router} = require('express');
const {loadFile} = require('../controllers/uploads');
const router = Router();

router.post('/', loadFile);

module.exports = router;