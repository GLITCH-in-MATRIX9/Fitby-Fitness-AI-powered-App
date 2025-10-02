// chatRoutes.js
const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client with API key
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model config (use flash for speed)
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

// Create a chat session
const chat = model.startChat();

// Retry settings
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Send message to Gemini with retries for transient errors.
 */
const sendMessageWithRetry = async (message, attempt = 1) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    const error = new Error("Cannot send an empty or invalid message to the AI model.");
    error.status = 400;
    throw error;
  }

  try {
    const result = await chat.sendMessage(message);
    return result;
  } catch (err) {
    const statusCode = err.status || 500;

    if ((statusCode === 503 || statusCode === 429) && attempt < MAX_RETRIES) {
      const delay = INITIAL_DELAY_MS * attempt;
      console.log(
        `API Error (${statusCode}). Retrying in ${delay}ms... (Attempt ${attempt}/${MAX_RETRIES})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendMessageWithRetry(message, attempt + 1);
    }

    throw err;
  }
};

// -----------------------------------------------------------------
// Route Handler
// -----------------------------------------------------------------
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "The 'message' field is required in the request body." });
  }

  try {
    const result = await sendMessageWithRetry(message);

    // Correct way to extract response text
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Chat API Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Something went wrong during AI generation.",
    });
  }
});

module.exports = router;
