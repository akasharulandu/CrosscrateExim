const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/authMiddleware'); // You must have admin middleware

// Existing routes...

// New Route
router.put('/product/:id/dimensions', isAdmin, productController.updateDimensions);

module.exports = router;
