const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../middleware/auth");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  getBlogsByUser,
  updateBlog,
} = require("../controllers/blogController");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// Blog routes
router.post("/", authenticateToken, upload.single("headerImage"), createBlog);
router.get("/", getAllBlogs);
router.get("/user/:userId", getBlogsByUser);
router.get("/:id", getBlogById);
router.delete("/:id", authenticateToken, deleteBlog);
router.put("/:id", authenticateToken, upload.single("headerImage"), updateBlog);

module.exports = router;
