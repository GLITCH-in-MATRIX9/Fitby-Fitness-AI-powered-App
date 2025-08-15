const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  description: String,
  gender: { type: String, enum: ["male", "female", "all"], default: "all" },
  muscle: { type: String }, // e.g., chest, legs, back
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", videoSchema);
