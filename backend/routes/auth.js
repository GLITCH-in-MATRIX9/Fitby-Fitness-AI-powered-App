

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../middleware/upload");
const User = require("../models/User");

// Signup Route
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const user = new User({
      name,
      email,
      password,
      image: `/uploads/${req.file.filename}`,
    });

    await user.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    res.status(500).json({ message: "Server error during signup" });
  }
});



// Login Route with JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
    console.error(err);
    console.log("Backend: User object being SENT to frontend:", userToSend);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
