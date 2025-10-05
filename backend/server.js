const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogRoutes");
const videoRoutes = require("./routes/videoRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiDietPlanRoutes = require("./routes/aiDietPlanRoutes");

const chatRoutes = require("./routes/chatRoutes"); // GPT4All chat route
const paymentRoute = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fitby-fitness-ai-powered-app-in6l.vercel.app",
    "https://fitby-fitness-ai-powered-app-in6l.vercel.app",
    "https://fitby-ai-powered-app-qk94.vercel.app",
    "https://fitby-fitness-ai-powered-git-cf2b3f-glitch-in-matrix9s-projects.vercel.app",
    "https://fitby-fitness-ai-powered-app-in6l-pb8o9dxn7.vercel.app" 
  ],
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/orkes-diet", aiDietPlanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/personalized-trainer", paymentRoute);
app.use("/model", express.static(path.join(__dirname, "public/model")));

// MongoDB connection
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
