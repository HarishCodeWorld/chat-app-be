const express = require("express");
const { Message } = require("../models/Messages");
const { authenticateToken } = require("./authen"); // Middleware from auth to check token
const router = express.Router();
const chatHandlers = require("../handlers/chatHandlers"); // Import the handlers

console.log({authenticateToken})

// Get previous chat messages
router.get("/messages", authenticateToken, async (req, res) => {
  try {
    // Retrieve all messages from the database
    const messages = await Message.find().sort({ createdAt: 1 }); // Sort by time (oldest first)
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login or signup using phone number
router.get("/get-messages/:userId/:receiverId",authenticateToken, chatHandlers.getMessagesByUserId); 


module.exports = router;
