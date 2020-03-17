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

// role: {
//   type: String,
//   default: 'basic',
//   enum: ["basic", "teamlead", "admin"]
// },
const User = mongoose.model("user", UserSchema);
module.exports = User;
