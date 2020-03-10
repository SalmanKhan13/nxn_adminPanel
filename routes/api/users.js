const express = require('express');
const router = express.Router();
//const { check, validationResult } = require('express-validator/check');

//const User = require('../../models/User');

// @route    GET api/users
// @desc     Testing user
// @access   Public
router.get('/',(req,res)=>{
    res.send("Hello from admin panel");
})














module.exports = router;
