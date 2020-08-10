const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    firstName : {
      type: String
    },
    lastName : {
      type: String
    },
    displayName : {
      type: String
    }
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  birthDate : {
    type: Date
  },
  phoneNumber : {
    type: String
  },
  nidNumber : {
    type: String
  },
  gender: {
    type: String
  },
  role:{
    type: String
  },
  verified:{
    type: Boolean,
    default: true
  },
  updated: { 
    type: Date, 
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
