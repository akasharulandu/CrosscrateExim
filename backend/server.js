import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// Secret key for JWT
const SECRET = process.env.JWT_SECRET || "supersecretkey"; // use env variable if possible

// Admin credentials (hardcoded for now, but recommend moving to env)
const ADMIN = { username: "admin", password: "admin123" };

// MongoDB Models
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

// JWT Authentication Middleware
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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ------------------- Routes -------------------

// Admin Login Route (Get token)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Get all Products (Public)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// Upload new Product (Admin only)
app.post("/api/products/upload", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      dimensions: dimensions ? JSON.parse(dimensions) : []
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Product upload failed" });
  }
});

// Delete Product (Admin only)
app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// Update Product (Admin only)
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
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
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

// Upload Hero Image (Admin only)
app.post("/api/hero/upload", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const newHeroImage = new HeroImage({ imageUrl: `/uploads/${req.file.filename}` });
    await newHeroImage.save();
    res.json(newHeroImage);
  } catch (err) {
    res.status(500).json({ message: "Hero image upload failed" });
  }
});

// Upload Login Background (Admin only)
app.post("/api/login-background/upload", authMiddleware, upload.single("bgImage"), async (req, res) => {
  try {
    const newBackground = new LoginBackground({ imageUrl: `/uploads/${req.file.filename}` });
    await newBackground.save();
    res.json({ success: true, imageUrl: newBackground.imageUrl });
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

// ------------------- Server Startup -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
