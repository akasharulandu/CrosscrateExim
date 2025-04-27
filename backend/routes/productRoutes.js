import express from 'express';
import productController from '../controllers/productController.js'; // Use import instead of require
import { isAdmin } from '../middleware/authMiddleware.js'; // Use import instead of require

const router = express.Router();

// Existing routes...

// New Route to update dimensions of a product
router.put('/product/:id/dimensions', isAdmin, productController.updateDimensions);

export default router;  // Use export default
