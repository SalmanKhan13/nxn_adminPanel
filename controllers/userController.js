const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AccessControl = require("accesscontrol");
const bcrypt = require("bcrypt");

//const {roles} = require('../roles')

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function() {
  return async (req, res, next) => {
    try {
   //   console.log("can it hiiiiiiiiiiiiiiiiitttttttt");
      const user = res.locals.loggedInUser;
    //  console.log('test2--------- ',user.roles);
      
     

               let grantList = [];
       for (var i = 0; i < user.roles.length; i++) {
        //  user.roles[i].resource.forEach(x=>{
        //     let obj={ role:, resource: x, action: "update:any", attributes: '*, !views' };
        //     grantList.push(obj);
        //  })
        // var length = Math.max(
        //   user.roles[i].resource.length,
        //   user.roles[i].action.length
        // );
        for (var j = 0; j < user.roles[i].action.length; j++) {
            let obj={ role:user.roles[i].role, resource:user.roles[i].resource , action: user.roles[i].action[j]?user.roles[i].action[j]:null, attributes: '*' }
            grantList.push(obj);
          //  var ac = new AccessControl(grantList);
        }
     }
     console.log(grantList);
     
     const ac = new AccessControl(grantList);
      //   console.log("grantList: ", grantList);
      //    let grantList = [
      //             { role:"admin", resource: "products", action: "update:any", attributes: '*, !views' }
      //         ];
        // grantList.forEach((y,index)=>{
        //     console.log('index: ',index,' data: ',y);
        //     const ac = new AccessControl();
        //       const acc = ac.setGrants(y);
        //       console.log(acc);
        //       console.log(ac.getGrants());
        // })
        //   

       const permission = ac.can(req.user.roles);  //[action](resource);
       //console.log(permission);
       console.log(ac.getGrants());
        console.log("permission granted ",permission.granted)
      if (!permission.granted) {
         console.log(!permission.granted)
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

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
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password, roles } = req.body;

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      roles: req.body
      //  role: role || "basic"
    });

    //console.log(newUser);
    const accessToken = jwt.sign(
      {
        userId: newUser._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    newUser.accessToken = accessToken;
   // console.log(newUser);
    await newUser.save();
    res.json({
      data: newUser,
      message: "You have signed up successfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error("Password is not correct"));
    const accessToken = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    await User.findByIdAndUpdate(user._id, {
      accessToken
    });
    res.status(200).json({
      data: {
        email: user.email,
        roles: user.roles
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, {
      role
    });
    const user = await User.findById(userId);
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userid=await User.findByIdAndDelete(userId);
    if(userid==null){
    res.status(200).json({
      data: userid,
      message: "User Not Found"
    });
  }else{
    console.log(userId);
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: userid,
      message: "User has been deleted"
    });
  }
  } catch (error) {
    next(error);
  }
};


// const values= user.roles.map(value=>{
      //     let grantList = [
      //         {role:value.role, resource: value.resource, action: value.action, attributes: '*, !views' }
      // ]

      //     const ac = new AccessControl();
      //     const acc = ac.setGrants(grantList);
      //    // console.log(acc);
      //     console.log(ac.getGrants());
      //     return grantList;
      // })