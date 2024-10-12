const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users").default;
const { config } = require("../config");

// // Login with phone number
// exports.login = async (req, res) => {
//   const { phoneNumber, password } = req.body;

//   try {
//     let user = await User.findOne({ phoneNumber });
//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid password" });
//     }

//     const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret, {
//       expiresIn: "15m",
//     });
//     const refreshToken = jwt.sign(
//       { userId: user._id },
//       config.jwtRefreshSecret,
//       { expiresIn: "7d" }
//     );

//     user.tokens = { accessToken, refreshToken };
//     await user.save();

//     res.json({ accessToken, refreshToken });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// };

// exports.refreshToken = async (req, res) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return res.status(401).json({ msg: "Refresh token required" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(401).json({ msg: "User not found" });
//     }

//     const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret, {
//       expiresIn: "15m",
//     });
//     res.json({ accessToken });
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid refresh token" });
//   }
// };
