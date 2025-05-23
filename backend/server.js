import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Ensure 'uploads' folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Constants
const SECRET = process.env.JWT_SECRET || "supersecretkey";
const ADMIN = { username: "admin", password: "admin123" };

// Models
const Product = mongoose.model("Product", new mongoose.Schema({
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
}));

const HeroImage = mongoose.model("HeroImage", new mongoose.Schema({
  imageUrl: String
}));

const LoginBackground = mongoose.model("LoginBackground", new mongoose.Schema({
  imageUrl: String,
  uploadedAt: { type: Date, default: Date.now }
}));

// Middleware: JWT Auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Multer Setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });
const upload = multer({
  dest: path.join(uploads, 'uploads/'), // folder to store uploads
});

// ------------------- Routes -------------------

// Admin Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Get Products (Public)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// Upload Product (Admin)
app.post("/api/products/upload", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      dimensions: dimensions ? JSON.parse(dimensions) : []
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Product upload failed", error: err.message });
  }
});

// Delete Product (Admin)
app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});

// Update Product (Admin)
app.put("/api/products/:id", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;
    const updateData = {
      name,
      description,
      price,
      dimensions: dimensions ? JSON.parse(dimensions) : [],
    };
    if (req.file) {
      updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
});

// Get Hero Image (Public)
app.get("/api/hero", async (req, res) => {
  try {
    const heroImage = await HeroImage.findOne().sort({ _id: -1 });
    res.json(heroImage || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hero image" });
  }
});

// Upload Hero Image (Admin)
app.post("/api/hero/upload", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newHeroImage = new HeroImage({ imageUrl });
    await newHeroImage.save();
    res.json(newHeroImage);
  } catch (err) {
    res.status(500).json({ message: "Hero image upload failed" });
  }
});

// Upload Login Background (Admin)
app.post("/api/login-background/upload", authMiddleware, upload.single("bgImage"), async (req, res) => {
  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newBackground = new LoginBackground({ imageUrl });
    await newBackground.save();
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ message: "Login background upload failed" });
  }
});

// Get Latest Login Background (Public)
app.get("/api/login-background", async (req, res) => {
  try {
    const latestBackground = await LoginBackground.findOne().sort({ uploadedAt: -1 });
    res.json({ imageUrl: latestBackground?.imageUrl || "" });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch login background" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
