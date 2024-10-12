require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret',
  port: process.env.PORT || 5000
};
