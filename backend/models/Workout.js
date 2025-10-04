// models/Workout.js
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date, 
      required: true,
    },
    workout: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // Store in minutes for consistency
      required: true,
      min: [1, "Duration must be at least 1 minute"],
    },
    calories: {
      type: Number,
      required: true,
      min: [0, "Calories cannot be negative"],
    },
    points: {
      type: Number,
      required: true,
      min: [0, "Points cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
