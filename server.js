const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { mongoURI, port } = require("./config");
const { router } = require("./routes/authen");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/users");
const saveMessage = require("./handlers/messageHandlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", router);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// WebSocket connection
global.io = io;
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send_message", async (data) => {
    console.log("send_message: ", { data });

    try {
      const savedMessage = await saveMessage(data);

      io.emit(data.receiverNumber, data);

      console.log("Message saved and broadcasted:", savedMessage);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("send_image", async (imageData) => {
    try {
      console.log("Image received", { imageData });
      const savedMessage = await saveMessage(imageData);
      console.log("Message saved and broadcasted:", savedMessage);
      io.emit(`image_${imageData.receiverNumber}`, imageData);
    } catch (error) {
      console.error("Error handling Image:", error);
    }
  });

  socket.on("typing", async (data) => {
    try {
      console.log("typing listen..");
      io.emit(`typing_${data.receiverNumber}`, data);
    } catch (err) {
      console.error("Error handling Typing:", err);
    }
  });

  socket.on("stop_typing", async (data) => {
    try {
      console.log("stop_typing listen..", { data });
      io.emit(`stop_typing_${data.receiverNumber}`, data);
    } catch (err) {
      console.error("Error handling Typing:", err);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
