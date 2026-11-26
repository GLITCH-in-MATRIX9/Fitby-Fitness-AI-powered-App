const Video = require("../models/Video");

const YOUTUBE_MUSCLES = {
  abdominals: "abdominal core",
  biceps: "biceps",
  calves: "calves",
  chest: "chest",
  forearms: "forearms",
  glutes: "glutes",
  hands: "hand grip",
  hamstrings: "hamstrings",
  lats: "lat back",
  lowerback: "lower back",
  middletraps: "middle traps",
  obliques: "obliques",
  quads: "quadriceps",
  triceps: "triceps",
  traps: "trapezius",
  trapsmiddle: "middle traps",
  fshoulders: "front shoulders",
  frontshoulders: "front shoulders",
  rshoulders: "rear shoulders",
  rearshoulders: "rear shoulders",
};

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

// @desc   Search YouTube for videos matching a muscle and gender
// @route  GET /api/videos/youtube-search
exports.searchYouTubeVideos = async (req, res) => {
  const muscle = typeof req.query.muscle === "string" ? req.query.muscle.toLowerCase() : "";
  const gender = typeof req.query.gender === "string" ? req.query.gender.toLowerCase() : "";
  const muscleName = YOUTUBE_MUSCLES[muscle];

  if (!muscleName || !["male", "female"].includes(gender)) {
    return res.status(400).json({ error: "A valid muscle and gender are required" });
  }

  try {
    const youtubeSearch = await import("youtube-search-without-api-key");
    const results = await youtubeSearch.search(`${gender} ${muscleName} workout exercises`);
    const videos = results
      .filter((video) => video.id?.videoId)
      .slice(0, 8)
      .map((video) => ({
        videoId: video.id.videoId,
        videoUrl: video.url || `https://www.youtube.com/watch?v=${video.id.videoId}`,
        title: video.title || video.snippet?.title || `${muscleName} workout`,
        description: video.description || "",
        thumbnailUrl:
          video.snippet?.thumbnails?.high?.url ||
          video.snippet?.thumbnails?.default?.url ||
          `https://img.youtube.com/vi/${video.id.videoId}/hqdefault.jpg`,
      }));

    res.status(200).json(videos);
  } catch (err) {
    console.error("Error searching YouTube videos:", err);
    res.status(502).json({ error: "Unable to fetch workout videos from YouTube" });
  }
};


// @desc   Get all videos (with optional filters)
// @route  GET /api/videos
exports.getVideos = async (req, res) => {
  try {
    const { muscle, gender } = req.query;

    const query = {};
    if (muscle) query.muscle = muscle.toLowerCase();
    if (gender && gender.toLowerCase() !== "all") {
      query.gender = { $in: [gender.toLowerCase(), "all"] };
    }

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
