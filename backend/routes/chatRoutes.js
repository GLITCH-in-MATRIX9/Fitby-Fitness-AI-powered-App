// chatRoutes.js
const express = require("express");
const router = express.Router();
// 1. Import the Google Gen AI SDK
const { GoogleGenAI } = require("@google/genai"); 
require("dotenv").config(); // Ensure dotenv is available for the API key

// 2. Initialize the Gemini client
// The API key is automatically read from the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({}); 

// Specify the model for the chat. gemini-2.5-flash is generally a great choice for chat.
const model = "gemini-2.5-flash"; 

// Create a new chat session to maintain conversation history
const chat = ai.chats.create({ model });

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // 3. Use the chat session to send the message and get a reply
    const result = await chat.sendMessage({ message });

    // 4. The response format is different, extract the text
    const reply = result.text;

    res.json({ reply });
  } catch (err) {
    console.error("Chat API Error:", err);
    // Log more detailed error information if needed
    // console.error("Error details:", err.response ? err.response.data : err.message); 
    res.status(500).json({ error: "Something went wrong during AI generation." });
  }
});

module.exports = router;