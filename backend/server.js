const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogRoutes");
const videoRoutes = require("./routes/videoRoutes");
const workoutRoutes = require('./routes/workoutRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/videos", videoRoutes);
app.use('/api/workouts', workoutRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
