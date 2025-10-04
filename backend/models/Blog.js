const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  headerImage: String,
  tags: [String],
  author: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
