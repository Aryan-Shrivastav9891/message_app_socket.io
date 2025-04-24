const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("barer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorize , Token fail" });
    }
  } else {
    res.status(400).json({ message: "Token not found" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      req
        .status(403)
        .json({ message: "user not authenticated to create the Group" });
    }
  } catch (error) {
    res.status(401).json({ message: "not Authenticated" });
  }
};

module.exports = {protect , isAdmin};
