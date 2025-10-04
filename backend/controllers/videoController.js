const Video = require("../models/Video");

// @desc   Create a new video
// @route  POST /api/videos
exports.createVideo = async (req, res) => {
  try {
    const { title, videoUrl, muscle, gender } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const newVideo = new Video({
      title,
      videoUrl,
      muscle: muscle?.toLowerCase(),
      gender: gender?.toLowerCase(),
    });


    const saved = await newVideo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating video:", err);
    res.status(500).json({ error: "Server error while creating video" });
  }
};


// @desc   Get all videos (with optional filters)
// @route  GET /api/videos
exports.getVideos = async (req, res) => {
  try {
    const { muscle, gender } = req.query;

    const query = {};
    if (muscle) query.muscle = muscle.toLowerCase();
    if (gender) query.gender = gender.toLowerCase();

    const videos = await Video.find(query);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching videos" });
  }
};

// @desc   Get single video by ID
// @route  GET /api/videos/:id
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json(video);
  } catch (err) {
    console.error("Error fetching video:", err);
    res.status(500).json({ error: "Server error while fetching video" });
  }
};

// @desc   Update video by ID
// @route  PUT /api/videos/:id
exports.updateVideo = async (req, res) => {
  try {
    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Video not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating video:", err);
    res.status(500).json({ error: "Server error while updating video" });
  }
};

// @desc   Delete video by ID
// @route  DELETE /api/videos/:id
exports.deleteVideo = async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Video not found" });

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ error: "Server error while deleting video" });
  }
};
