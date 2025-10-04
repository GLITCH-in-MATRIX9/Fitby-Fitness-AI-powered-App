const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/upload"); // dynamic Cloudinary multer
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  getBlogsByUser,
  updateBlog,
} = require("../controllers/blogController");

// ---------------------- 🎯 Blog Routes 🎯

// Create a new blog (with optional header image)
// Header image will be uploaded to: fitby/blogs/{userId}/
router.post(
  "/",
  authenticateToken,
  upload.single("headerImage"),
  createBlog
);

// Get all blogs
router.get("/", getAllBlogs);

// Get blogs by specific user
router.get("/user/:userId", getBlogsByUser);

// Get a single blog by ID
router.get("/:id", getBlogById);

// Delete a blog by ID (requires auth)
router.delete("/:id", authenticateToken, deleteBlog);

// Update a blog by ID (with optional header image)
// Updated header image will be uploaded to: fitby/blogs/{userId}/
router.put(
  "/:id",
  authenticateToken,
  upload.single("headerImage"),
  updateBlog
);

module.exports = router;
