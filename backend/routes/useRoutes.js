const express = require("express");
const User = require("../models/UserModels");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

//! register Route
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "user already exist" });
    }
    //* create new User
    const user = await User.create({
      username: username,
      email,
      password,
    });
    console.log(user, "REGISTER USER");
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//! Login

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isPasswordValid = await user.verifyPassword(password);

    if (isPasswordValid) {
      const token = generateToken(user._id);
      console.log(user._id, user.username, user.email, user.isAdmin, token);
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      return res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//! generate token
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
    algorithm: "HS256",
  });
  // console.log("this is my token", token);
  return token;
};

module.exports = userRouter;
