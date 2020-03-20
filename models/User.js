const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
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
 
});
const User = mongoose.model("user", UserSchema);
module.exports = User;





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

// // role: {
// //   type: String,
// //   default: 'basic',
// //   enum: ["basic", "teamlead", "admin"]
// // },
// const Users = mongoose.model("users", UserSchema);
// module.exports = Users;
