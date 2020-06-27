const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const controllers = require("../../controllers/userController");
const { forgotPasswordValidator, resetPasswordValidator, registerValidator, loginValidator } = require("../../helpers/valid");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/", registerValidator,
  auth,
  controllers.grantAccess("updateAny", "product_upload"),
  controllers.createUser
);

// @route    POST api/users/
// @desc     Authenticate user & get token
// @access   Public
router.post(
  "/auth",
  loginValidator,
  controllers.loginUser
);


// @route    Get api/users/search
// @desc     Search User through email address
// @access   private
router.get("/search", controllers.searchUser);

// @route    PUT api/users/forgotpassword
// @desc     Forgot Password
// @access   Public
router.put(
  "/forgotpassword",
  forgotPasswordValidator,
  controllers.forgotPasswordController
);

// @route    PUT api/users/resetpassword
// @desc     Reset Password
// @access   Public
router.put(
  "/resetpassword",
  resetPasswordValidator,
  controllers.resetPasswordController
);

// @route    GET api/users/
// @desc     Get user route
// @access   Private
router.get("/auth", auth, controllers.getUser);


// @route    GET api/users/
// @desc     Get all users
// @access   Private
router.get("/allusers", auth, controllers.getAllUser);


module.exports = router;
