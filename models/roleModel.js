const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
 user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
          },
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
  extend: {
    type: String
  }
});

const Role = mongoose.model("role", RoleSchema);
module.exports = Role;
