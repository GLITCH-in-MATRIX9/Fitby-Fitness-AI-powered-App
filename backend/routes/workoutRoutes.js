// routes/workoutRoutes.js
const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");

// POST /api/workouts - Add a new workout & update points
router.post("/", authenticateToken, async (req, res) => {
  const { date, workout, duration, calories, points } = req.body;

  if (!date || !workout || !duration || !calories || !points) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Save workout
    const newWorkout = new Workout({
      userId: req.user.id,
      date,
      workout,
      duration,
      calories,
      points,
    });

    const savedWorkout = await newWorkout.save();

    // 2. Update user points
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.points = (user.points || 0) + points;
    await user.save();

    // 3. Return saved workout
    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error("Error saving workout or updating points:", err);
    res.status(500).json({ error: "Failed to save workout" });
  }
});

// GET /api/workouts - Get all workouts for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// GET /api/workouts/points - Get total points for logged-in user
router.get("/points", authenticateToken, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    const totalPoints = workouts.reduce((sum, w) => sum + (w.points || 0), 0);
    res.json({ totalPoints });
  } catch (err) {
    console.error("Error fetching points:", err);
    res.status(500).json({ error: "Failed to fetch points" });
  }
});

module.exports = router;
