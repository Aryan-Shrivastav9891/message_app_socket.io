const express = require("express");
const Group = require("../models/GroupModels");
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const groutRoutes = express.Router();

//! Create New Group

groutRoutes.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { GroupName, description, } = req.body;

    const group = await Group.create({
      name: GroupName,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });
    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ populatedGroup });
    // console.log("populatedGroup", populatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//! gating all groups
groutRoutes.get("/", protect, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ groups });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

//! Joining All groups
groutRoutes.post("/:groupId/join", protect, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    console.log("groupId", groupId);
    console.log("group.members", group.members);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already Member of this group",
      });
    }
    group.members.push(req.user._id);
    await group.save();
    res.status(200).json({ message: "Successfully join this group" });
  } catch (error) {
    console.log("in catch block");
    res.status(400).json(error.message);
  }
});

module.exports = groutRoutes;
