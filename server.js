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
    origin: "*", // Adjust this to your frontend's origin if necessary
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

let users = {}; // Track users and their socket IDs

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// WebSocket connection
global.io = io;
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for send_message event
  socket.on("send_message", async (data) => {
    console.log("send_message: ", { data });

    try {
      // Save the message using the saveMessage function
      const savedMessage = await saveMessage(data);

      // Broadcast the message to the intended recipient using the socket ID or conversation
      io.emit(data.receiverNumber, data); // Emit to specific recipient (adjust as needed)

      console.log("Message saved and broadcasted:", savedMessage);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // video call 1.0
  // socket.on("offer", (offer) => {
  //   console.log("got offer..");
  //   io.emit("offer", offer);
  // });

  // socket.on("answer", (answer) => {
  //   io.emit("answer", answer);
  // });

  // socket.on("ice-candidate", (candidate) => {
  //   io.emit("ice-candidate", candidate);
  // });

  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });

  // video 2.0
  // Handle signaling data (offer, answer, and ICE candidates)
  // socket.on("call-user", (data) => {
  //   console.log({ data });
  //   console.log("emitting to : ", `receive-call_${data.to}`);
  //   io.emit(`receive-call_${data.to}`, { offer: data.offer, from: data.from });
  // });

  // socket.on("answer-call", (data) => {
  //   io.emit(`call-answered_${data.to}`, {
  //     answer: data.answer,
  //     from: data.to,
  //   });
  // });

  // socket.on("ice-candidate", (data) => {
  //   io.emit("ice-candidate", {
  //     candidate: data.candidate,
  //     from: data.from,
  //   });
  // });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  // });

  socket.on("join", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("call-user", ({ to, offer }) => {
    io.to(users[to]).emit("incoming-call", { from: socket.id, offer });
  });

  socket.on("answer-call", ({ to, answer }) => {
    io.to(users[to]).emit("call-answered", { answer });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
