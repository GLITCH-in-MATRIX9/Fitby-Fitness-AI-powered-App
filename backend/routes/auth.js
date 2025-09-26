const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../middleware/upload");
const User = require("../models/User"); // Assuming your User model is here

// Orkes Conductor SDK
const { orkesConductorClient } = require("@io-orkes/conductor-javascript");

// ---------------------- 🎯 Orkes Conductor Client Configuration 🎯 ----------------------
// This code initializes the Orkes client by reading credentials from your environment variables.
// The variables must be set in your Render dashboard for this to work.
let conductorClient;
(async () => {
    try {
        conductorClient = await orkesConductorClient({
            serverUrl: process.env.CONDUCTOR_URL,
            keyId: process.env.ORKES_API_KEY.split(":")[0],
            keySecret: process.env.ORKES_API_KEY.split(":")[1],
        });
        console.log("✅ Connected to Orkes Conductor");
    } catch (err) {
        console.error("❌ Failed to init Orkes client:", err.message);
    }
})();

// ---------------------- 🎯 Signup Route 🎯 ----------------------
router.post("/signup", upload.single("image"), async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!req.file) return res.status(400).json({ message: "Image required" });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already in use" });

        const user = new User({
            name,
            email,
            password, // ❗ In production, hash this with bcrypt!
            image: `/uploads/${req.file.filename}`,
        });

        await user.save();
        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        console.error(err);
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        res.status(500).json({ message: "Server error during signup" });
    }
});

// ---------------------- 🎯 Login Route 🎯 ----------------------
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // NOTE: In production, use bcrypt.compare(password, user.password).
        if (!user || user.password !== password) { 
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 🎯 Trigger the Orkes workflow after successful login 🎯
        if (conductorClient) {
            try {
                await conductorClient.workflowClient.startWorkflow({
                    name: "user_login_workflow", 
                    version: 2,
                    input: {
                        credentials: { username: user.name, email: user.email, userId: user._id },
                        loginTime: new Date().toISOString(),
                        newDevice: false, 
                    },
                });
                console.log(`🚀 Triggered workflow for user ${user.email} (Version 2)`);
            } catch (wfErr) {
                console.error("❌ Error triggering workflow:", wfErr.message);
            }
        }

        // Send response back to frontend
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// ---------------------- 🎯 Workflow Endpoints 🎯 ----------------------
// These endpoints are called by your Orkes workflow after a successful login.
// ---------------------- LOGGING ENDPOINT ----------------------
router.post("/logs", async (req, res) => {
    const { userId, event, time } = req.body;
    console.log(`[LOG REC'D] Event: ${event} for User ID: ${userId} at ${time}`);
    res.status(200).json({ status: "success", message: "Log entry processed by backend" });
});

// ---------------------- NOTIFICATION ENDPOINT ----------------------
router.post("/notifications/send", async (req, res) => {
    const { to, subject, message } = req.body;
    console.log(`[NOTIFICATION REC'D] Ready to send email to: ${to}, Subject: ${subject}`);
    res.status(200).json({ status: "success", message: `Email queued for ${to}` });
});

module.exports = router;