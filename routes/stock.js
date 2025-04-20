const { Router } = require('express');
const { check } = require('express-validator'); // Import express-validator for validation

const {
    stockGet,
    stockGetById, // Added a specific controller for getting by ID
    stockPost,
    stockPut,
    stockDelete
} = require('../controllers/stock'); // Adjust path if needed

const { validateFields } = require('../middlewares/validate-fields'); // To handle validation results

const router = Router();

router.get('/', [
    check('productCode', 'Product code is required').not().isEmpty().trim(),
], stockGet);

router.get('/:id', [
    check('id', 'Invalid MongoDB ID format').isMongoId(), // Validate the ID format
    validateFields // Check validation results
], stockGetById); // Use the specific controller for getting by ID

router.post('/', [
    check('productCode', 'Product code is required').not().isEmpty().trim(),
    check('quantity', 'Quantity must be a non-negative integer').isInt({ min: 0 }),
    check('expirationDate', 'Expiration date is required and must be a valid date').isISO8601().toDate(),
    check('costPrice', 'Cost price must be a non-negative number').isFloat({ min: 0 }),
    check('campaign', 'Campaign is required').optional().not().isEmpty().trim(), // Optional example
    validateFields // Check validation results
], stockPost);

router.put('/:id', [
    check('id', 'Invalid MongoDB ID format').isMongoId(),
    check('quantity', 'Quantity must be a non-negative integer').optional().isInt({ min: 0 }),
    check('expirationDate', 'Expiration date must be a valid date').optional().isISO8601().toDate(),
    check('costPrice', 'Cost price must be a non-negative number').optional().isFloat({ min: 0 }),
    check('location', 'Location must be a string').optional().isString().trim(),
    check('notes', 'Notes must be a string').optional().isString().trim(),
    validateFields // Check validation results
], stockPut);

router.delete('/:id', [
    check('id', 'Invalid MongoDB ID format').isMongoId(),
    validateFields // Check validation results
], stockDelete);

module.exports = router;