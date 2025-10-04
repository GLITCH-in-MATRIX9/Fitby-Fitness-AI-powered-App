const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  dob: Date,
  gender: String,
  weight: Number,
  height: Number,
  bodyFat: Number,
  fitnessGoals: String,
  activityLevel: String,
  allergies: String,
  emergencyContact: String,
  nutrition: String,
  supplements: String,
  image: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
