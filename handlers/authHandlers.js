const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users"); // Correct path to your User model
const { jwtSecret, jwtRefreshSecret } = require("../config");

const authHandlers = {
  async login(req, res) {
    console.log("inside login..", req.body);
    const { phoneNumber, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ phoneNumber });
      console.log({ user });
     
      if (!user) {
        return res.status(404).json({ message: "User not found! Please sign up.." });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      // Generate JWT Access Token
      const accessToken = jwt.sign(
        { id: user._id, phoneNumber: user.phoneNumber },
        jwtSecret,
        { expiresIn: "5d" }
      );

      // Generate JWT Refresh Token
      const refreshToken = jwt.sign({ id: user._id }, jwtRefreshSecret, {
        expiresIn: "7d",
      });

      res.json({ accessToken, refreshToken, userId: user._id, phoneNumber: user.phoneNumber, name: user.name });
    } catch (err) {
      console.log("Error in login...", { err });
      res.status(500).json({ message: "Server error" });
    }
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh Token Required" });

    jwt.verify(refreshToken, jwtRefreshSecret, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid Refresh Token" });

      const newAccessToken = jwt.sign(
        { id: user.id, phoneNumber: user.phoneNumber },
        jwtSecret,
        { expiresIn: "5d" }
      );
      res.json({ accessToken: newAccessToken });
    });
  },

  async signUp(req, res) {
    const { phoneNumber, password, name } = req.body;
    console.log(req.body);
    try {
      // Check if user already exists
      let existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        phoneNumber,
        passwordHash: hashedPassword,
        name,
      });

      // Save the user
      await newUser.save();

      // Generate JWT Access Token
      const accessToken = jwt.sign(
        { id: newUser._id, phoneNumber: newUser.phoneNumber },
        jwtSecret,
        { expiresIn: "10d" }
      );

      // Generate JWT Refresh Token
      const refreshToken = jwt.sign({ id: newUser._id }, jwtRefreshSecret, {
        expiresIn: "365d",
      });

      // Update the user with the tokens
      newUser.tokens = { accessToken, refreshToken };
      await newUser.save(); // Save the updated user document with tokens

      // Return tokens
      res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = authHandlers;
