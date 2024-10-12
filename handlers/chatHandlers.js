const Message = require("../models/Messages"); // Correct path to your User model

const chatHandlers = {
    async getMessagesByUserId(req, res) {
        const { userId, receiverId } = req.params; // Get userId and receiverId from request parameters
      
        try {
          const messages = await Message.find({
            $or: [
              { senderId: userId, recipientId: receiverId },
              { senderId: receiverId, recipientId: userId },
            ],
          }).sort({ createdAt: -1 });
      
          if (!messages.length) {
            return res.status(404).json({ message: "No messages found." });
          }
      
          res.status(200).json(messages); // Return the found messages
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error." });
        }
      }
      
};

module.exports = chatHandlers;
