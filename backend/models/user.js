const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const encryption = require("../utils/encryption");

const User = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

User.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model("User", User);
