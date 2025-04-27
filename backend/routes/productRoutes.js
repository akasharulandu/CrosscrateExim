// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Optional: JWT auth middleware (if needed for admin-only routes)
// const authMiddleware = require('../middleware/auth'); 

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Helper to parse dimensions safely
const parseDimensions = (dimensions) => {
  try {
    return dimensions ? JSON.parse(dimensions) : [];
  } catch (err) {
    console.error('Dimension parsing error:', err);
    return [];
  }
};

// Fetch all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new product (Admin only)
router.post('/', /* authMiddleware, */ upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;

    const newProduct = new Product({
      name,
      description,
      price, // include price if your model supports it
      dimensions: parseDimensions(dimensions),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: 'Failed to create product' });
  }
});

// Update a product (Admin only)
router.put('/:id', /* authMiddleware, */ upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.dimensions = parseDimensions(dimensions);

    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: 'Failed to update product' });
  }
});

// Delete a product (Admin only)
router.delete('/:id', /* authMiddleware, */ async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
