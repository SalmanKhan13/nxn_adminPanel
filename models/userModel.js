const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String
  },

  roles: [
    {
      role: {
        type: String
      },
      resource: {
        type: String
      },
      action: {
        type: Array
       
      },
      attributes: {
        type: String
      },
      extend:{
        type:String
      }
    }
  ]
});

// role: {
//   type: String,
//   default: 'basic',
//   enum: ["basic", "teamlead", "admin"]
// },
const User = mongoose.model("user", UserSchema);
module.exports = User;
