const jwt = require("jsonwebtoken");
const config = require("config");
const Users = require("../models/Users");

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const { userId, exp } = await jwt.verify(token, config.get("jwtSecret"));
    //console.log("userId: "+userId, exp);
    res.locals.loggedInUser = await Users.findById(userId);

    // req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
