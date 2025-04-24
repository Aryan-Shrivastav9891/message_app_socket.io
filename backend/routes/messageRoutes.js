const express = require("express");
const Group = require("../models/GroupModels");
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const Message = require("../models/ChatModel");
const messageRouter = express.Router();

//! send message
messageRouter.post("/", protect, async (req, res) => {
  try {
    const { content, groupId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      content,
      group: groupId,
    });
    console.log("this is my message", message);
    const populatedMsg = await Message.findById(message._id).populate(
      "sender",
      "username email"
    );
    res.status(200).json(populatedMsg);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});

//! get messages a group
messageRouter.get("/:groupId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "username email")
      .sort({ createdAt: -1 }); // Change -1 to 1 for ascending, -1 for descending

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = messageRouter;
