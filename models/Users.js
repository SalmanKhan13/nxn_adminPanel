const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  
  resetTokenExpiration: Date,
  resetPasswordLink: {
    data: String,
    default: ''
  },
  role: {
    type: String,
    default: 'basic_user',
    enum: ["basic_user", "teamlead", "admin"]
  },
  token: {
    type: String
  }

});
const Users = mongoose.model("adminusers", UserSchema);
module.exports = Users;





// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   name:{
//     type: String
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   accessToken: {
//     type: String
//   },
//   role: {
//     type: String
//   },
//   resource: {
//     type: String
//   },
//   readAny:{
//     type: Boolean
//   },
//   accessToken: {
//     type: String
//   },

//   roles: [
//     {
//       role: {
//         type: String
//       },
//       resource: {
//         type: String
//       },
//       action: {
//         type: Array

//       },
//       attributes: {
//         type: String
//       },
//       extend:{
//         type:String
//       }
//     }
//   ]
// });