const Message = require("../models/Messages"); // Adjust the path as needed

const saveMessage = async (data) => {
  try {
    const { senderId, recipientId, content } = data;

    // Create a new message document
    const newMessage = new Message({
      senderId,
      recipientId,
      content,
    //   conversationId,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    return savedMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

module.exports = saveMessage;
