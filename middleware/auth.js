const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const config = require("../config/config");
var env = process.env.NODE_ENV || "development";
module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const { userId, exp } = await jwt.verify(token, config[env].jwtSecret);
    //console.log("userId: "+userId, exp);
    res.locals.loggedInUser = await Users.findById(userId);

    // req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
