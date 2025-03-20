const express = require('express');
const router = express.Router();
const numbersController = require('../controllers/numbersController');
const validation = require('../middleware/validation');


router.get('/:numberType', validation.validateNumberType, numbersController.getNumbersByType);

module.exports = router;