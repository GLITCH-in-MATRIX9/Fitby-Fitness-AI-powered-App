const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const upload = require("../middleware/upload"); // Cloudinary multer config
const User = require("../models/User"); // Your User model

// ---------------------- 🎯 Signup Route 🎯 ----------------------
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) return res.status(400).json({ message: "Profile image is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path, // Cloudinary URL
    });

    await user.save();
    res.status(201).json({ message: "Signup successful", user: {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    } });
  } catch (err) {
    console.error("Signup error:", err);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ---------------------- 🎯 Login Route 🎯 ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ---------------------- 🎯 Logging Endpoint 🎯 ----------------------
router.post("/logs", async (req, res) => {
  const { userId, event, time } = req.body;
  if (!userId || !event || !time) return res.status(400).json({ message: "All fields required" });

  console.log(`[LOG REC'D] Event: ${event} for User ID: ${userId} at ${time}`);
  res.status(200).json({ status: "success", message: "Log entry processed" });
});

// ---------------------- 🎯 Notification Endpoint 🎯 ----------------------
router.post("/notifications/send", async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) return res.status(400).json({ message: "All fields required" });

  console.log(`[NOTIFICATION REC'D] Ready to send email to: ${to}, Subject: ${subject}`);
  res.status(200).json({ status: "success", message: `Email queued for ${to}` });
});

module.exports = router;
