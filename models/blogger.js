const mongoose = require("mongoose");

const bloggerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String
  },
  phoneNumber: Number,
  password: {
    type: String
  },
  verified:{
    type: Boolean,
    default: true
  },
  photoUrl: String,
  created: { 
    type: Date, 
    default: Date.now
  }
});

const blogger = mongoose.model("blogger", bloggerSchema);

module.exports = blogger;
