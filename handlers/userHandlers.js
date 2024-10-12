const User = require("../models/Users"); // Correct path to your User model

const userHandlers = {
  async addContact(req, res) {
    const { userId, contactPhoneNumber } = req.body;

    try {
      // Step 1: Check if the user exists (the one who is adding the contact)
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Step 2: Check if the contact with the given phone number exists
      let contactUser = await User.findOne({ phoneNumber: contactPhoneNumber });
      if (!contactUser) {
        return res.status(404).json({ message: "Contact not found" });
      }

      // Step 3: Check if the contact is already in the user's contact list
      if (user.contacts.includes(contactUser._id)) {
        return res.status(400).json({ message: "Contact already added" });
      }

      // Step 4: Add the contact to the user's contact list
      user.contacts.push(contactUser._id);

      // Step 5: Save the updated user document
      await user.save();

      return res.status(200).json({
        message: "Contact added successfully",
        contacts: user.contacts,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async getContacts(req, res) {
    const { userId } = req.params;

    try {
      // Find the user by ID and populate their contacts
      const user = await User.findById(userId).populate(
        "contacts",
        "name phoneNumber"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the contacts with name and phone number
      res.status(200).json({ contacts: user.contacts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userHandlers;
