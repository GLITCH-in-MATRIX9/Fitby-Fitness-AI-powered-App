const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // <-- dynamic Cloudinary upload middleware
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// @route   GET /api/user/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/user/profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/user/upload-profile-image
router.put(
  "/upload-profile-image",
  authMiddleware,
  upload.single("image"), // <--Cloudinary storage with fitby/users folder
  async (req, res) => {
    try {
      const userId = req.user.id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          image: req.file.path, // Cloudinary URL
          updatedAt: new Date(),
        },
        { new: true }
      ).select("-password");

      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/user/leaderboard
router.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "name points image").sort({ points: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/user/change-password
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
