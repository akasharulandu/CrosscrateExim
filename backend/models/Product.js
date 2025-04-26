const mongoose = require('mongoose');

// Dimension Row Schema (sub-schema)
const dimensionSchema = new mongoose.Schema({
  ref: { type: String },
  grade: { type: String },
  length: { type: String },
  width: { type: String },
  height: { type: String },
  recommendedFor: { type: String },
  extraOptions: { type: String }
}, { _id: false });

// Main Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number }, // Keep price field if you need it
  imageUrl: { type: String },
  dimensions: [dimensionSchema], // New embedded field
});

module.exports = mongoose.model('Product', productSchema);
