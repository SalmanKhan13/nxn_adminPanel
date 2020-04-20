const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const Users = require('../../models/Users');
const controllers = require('../../controllers/userController');
const { forgotPasswordValidator, resetPasswordValidator } = require('../../helpers/valid');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email')
      .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
  ],auth, controllers.grantAccess('updateAny', 'product_upload'),                    // controllers.grantAccess('updateAny', 'product_upload'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await Users.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new Users({
        name,
        email,
        password,
        role: role || "basic_user"
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //await user.save();

      const payload = {
        // user: {
        //   userId: user.id
        // }
        userId: user._id
      };

     jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          user.token=token;
          user.save();
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    Get api/users/search
// @desc     Search User through email address
// @access   private
router.get('/search', controllers.searchUser);

// @route    PUT api/users/forgotpassword
// @desc     Forgot Password
// @access   Public
router.put('/forgotpassword', forgotPasswordValidator, controllers.forgotPasswordController);

// @route    PUT api/users/resetpassword
// @desc     Reset Password
// @access   Public
router.put('/resetpassword', resetPasswordValidator, controllers.resetPasswordController);

module.exports = router;
