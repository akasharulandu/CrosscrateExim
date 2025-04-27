import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Secret key for JWT
const SECRET = "supersecretkey";

// Admin credentials (hardcoded for now)
const ADMIN = { username: "admin", password: "admin123" };

// MongoDB Models
const Product = mongoose.model("Product", {
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  dimensions: [{
    ref: String,
    grade: String,
    length: String,
    width: String,
    height: String,
    recommendedFor: String,
    extraOptions: String,
  }]
});

const HeroImage = mongoose.model("HeroImage", { imageUrl: String });
const LoginBackground = mongoose.model("LoginBackground", { imageUrl: String, uploadedAt: { type: Date, default: Date.now } });

// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Admin Login Route (GET token)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false });
});

// GET Products (Public)
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST Product Upload (Admin only)
app.post("/api/products/upload", authMiddleware, upload.single("photo"), async (req, res) => {
  const { name, description, price, dimensions } = req.body;
  const product = new Product({
    name,
    description,
    price,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    dimensions: JSON.parse(dimensions) || [] // Parse dimensions if provided
  });
  await product.save();
  res.json(product);
});

// DELETE Product (Admin only)
app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// PUT Product (Admin only)
app.put("/api/products/:id", authMiddleware, upload.single("photo"), async (req, res) => {
  const { name, description, price, dimensions } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { 
      name,
      description,
      price,
      imageUrl: imageUrl || undefined,
      dimensions: JSON.parse(dimensions) || [] // Update dimensions if provided
    },
    { new: true }
  );
  res.json(updated);
});

// GET Hero Image (Public)
app.get("/api/hero", async (req, res) => {
  const image = await HeroImage.findOne().sort({ _id: -1 });
  res.json(image || {});
});

// POST Hero Image Upload (Admin only)
app.post("/api/hero/upload", authMiddleware, upload.single("photo"), async (req, res) => {
  const hero = new HeroImage({ imageUrl: `/uploads/${req.file.filename}` });
  await hero.save();
  res.json(hero);
});

// ✅ POST Login Background Upload (Admin only)
app.post("/api/login-background/upload", authMiddleware, upload.single("bgImage"), async (req, res) => {
  const background = new LoginBackground({ imageUrl: `/uploads/${req.file.filename}` });
  await background.save();
  res.json({ success: true, imageUrl: background.imageUrl });
});

// ✅ GET Latest Login Background Image (Public)
app.get("/api/login-background", async (req, res) => {
  const latest = await LoginBackground.findOne().sort({ uploadedAt: -1 });
  res.json({ imageUrl: latest?.imageUrl || "" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
