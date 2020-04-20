const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const controllers = require('../../controllers/userController');

const Users = require('../../models/Users');
const productController = require('../../controllers/products.controller');

// .single('csvFile')
const upload = require('../../middleware/products.fileupload.js');

const productsUploadRules = [
  check('user_email')
    .not()
    .isEmpty()
    .withMessage('User Email is required.'),
  check('catalog')
    .not()
    .isEmpty()
    .withMessage('Please Select Catalog First.')
];

// @route    POST api/auth/
// @desc     Upload Product
// @access   Public
router.post('/upload', auth, controllers.grantAccess('updateAny', 'product_upload'), upload.fileUpload, productsUploadRules, productController.upload);
// @route testing purpose
router.get('/test',auth,controllers.grantAccess('readAny','product_upload'), controllers.test);

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const users=res.locals.loggedInUser;
  
    const user = await Users.findById(users.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await Users.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        // user: {
        //   userId: user.id
        // }
        userId:user._id
      };

      const token= jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }); 
      
        await Users.findByIdAndUpdate(user._id, {
          token
        });
       
        
        res.json({ userId:user._id,name: user.name, email: user.email, role: user.role ,token:token
       });
      }
      
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
module.exports = router;
