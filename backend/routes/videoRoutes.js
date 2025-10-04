const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");

// @route   POST /api/videos
router.post("/", createVideo);

// @route   GET /api/videos
router.get("/", getVideos);

// @route   GET /api/videos/:id
router.get("/:id", getVideoById);

// @route   PUT /api/videos/:id
router.put("/:id", updateVideo);

// @route   DELETE /api/videos/:id
router.delete("/:id", deleteVideo);

module.exports = router;
