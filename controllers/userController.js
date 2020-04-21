const jwt = require("jsonwebtoken");
const User = require('../models/user.model.js');
const Users = require('../models/Users');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const config = require('config');
const bcrypt = require('bcryptjs');
const { roles } = require('../roles')

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
     
      const user = res.locals.loggedInUser;
      console.log("----------------------------- " + user.role)
      const permission = roles.can(user.role)[action](resource);  //req.user.role
      console.log(permission);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
exports.test=async(req,res,next) => {
res.send("logged in successfully")
}
/*
 |--------------------------------------------------------------------------
 | Search from Users list
 |--------------------------------------------------------------------------
*/
exports.searchUser = async function (req, res) {

  if (!req.query.search) {
    res.json([]);
    return;
  }
  try {
    const users = await User.aggregate([
      {
        $match: {
          email: { $regex: req.query.search, $options: 'i' }
        }
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          username: 1,
          email: 1,
        }
      }
    ]);
    res.json(users);
  } catch (err) {
    console.error(err);
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: "false",
  auth: {
    user: "salmank91922@gmail.com",
    pass: "asif9999"
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {

    const firstError = error.array().map(err => err.msg)[0];
    return res.status(422).json({
      error: firstError
    });
  } else {
    await Users.findOne(
      {
        email
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: 'User with that email does not exist'
          });
        }

        const token = jwt.sign(
          {
            _id: user._id
          },
          config.get('jwtSecret'),
          {
            expiresIn: '60m'
          }
        );

        const emailData = {
          from: 'salman.dev@pk.see.biz',
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p><a href='http://localhost:3000/reset/${token}'>http://localhost:3000/reset/${token}</a></p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p><a href='http://localhost:3000'>http://localhost:3000</a></p>
                `
        };

        return user.updateOne(
          {
            resetPasswordLink: token
          },
          (err, success) => {
            if (err) {
              console.log('RESET PASSWORD LINK ERROR', err);
              return res.status(400).json({
                error:
                  'Database connection error on user password forgot request'
              });
            } else {

              res.json({
                message: `Email has been sent to ${email}. Follow the instruction to activate your account`
              });

              return transporter.sendMail(emailData)
                .then(sent => {
                  console.log('SIGNUP EMAIL SENT', sent)

                })
                .catch(err => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    const firstError = error.array().map(err => err.msg)[0];
    return res.status(422).json({
      error: firstError
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, config.get('jwtSecret'), function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            error: 'Expired link. Try again'
          });
        }

        Users.findOne(
          {
            resetPasswordLink
          },
          async (err, user) => {
            if (err || !user) {
              return res.status(400).json({
                error: 'Something went wrong. Try Password again'
              });
            }
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(newPassword, salt);
            const updatedFields = {

              password: user.password,
              resetPasswordLink: ''
            };

            user = _.extend(user, updatedFields);

            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: 'Error resetting user password'
                });
              }
              res.json({
                message: `Great! Now you can login with your new password`
              });
            });
          }
        );
      });
    }
  }
};
