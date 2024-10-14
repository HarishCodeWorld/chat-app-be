const express = require("express");
const router = express.Router();
const authHandlers = require("../handlers/authHandlers"); // Import the handlers
const jwt = require("jsonwebtoken");

const { mongoURI, port, jwtSecret } = require("../config");


// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};
router.get("/test", authHandlers.test)

// Login or signup using phone number
router.post("/login", authHandlers.login); // Use the handler directly

// Route to refresh access token
router.post("/refresh-token", authHandlers.refreshToken); // Use the handler directly

router.post("/sign-up", authHandlers.signUp);

// Export authenticateToken so it can be used in other files
module.exports = {
  router, // Export the router
  authenticateToken, // Export the middleware
};
