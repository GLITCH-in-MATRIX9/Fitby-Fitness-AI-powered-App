// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogRoutes");
const videoRoutes = require("./routes/videoRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiDietPlanRoutes = require("./routes/aiDietPlanRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoute = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- MIDDLEWARE ----------------------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fitby-fitness-ai-powered-app-in6l.vercel.app",
    // add other allowed origins
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------- API ROUTES ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/orkes-diet", aiDietPlanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/personalized-trainer", paymentRoute);

// ---------------------- REACT FRONTEND ----------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  // All other routes not starting with /api → React index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// ---------------------- MONGODB CONNECTION ----------------------
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fitnessAppDB";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();
