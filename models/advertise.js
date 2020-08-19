const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: {
      type:String
  },
   class: {
    type: String
  },
  videoUrl:{
      type:String
  },
  updated: { 
    type: Date
  },
  created: { 
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ad", adSchema);
