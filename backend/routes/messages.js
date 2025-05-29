import express from "express";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/auth.js"; // We will export authMiddleware from a file

const router = express.Router();

// POST /api/messages - customer sends message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/messages - admin fetch all messages
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/messages/:id/reply - admin replies to message
router.put("/:id/reply", authMiddleware, async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.reply = reply;
    message.read = true;
    await message.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/messages/:id - admin deletes message
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
