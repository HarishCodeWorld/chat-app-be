const express = require("express");
const router = express.Router();
const userHandlers = require("../handlers/userHandlers");
const { authenticateToken } = require("./authen"); // Middleware from auth to check token

router.post("/add-contact",authenticateToken, userHandlers.addContact);
router.get("/get-contacts/:userId",authenticateToken, userHandlers.getContacts);

module.exports = router;
