const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
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
    type: Date, 
    default: Date.now
  },
  created: { 
    type: Date
  }
});

module.exports = mongoose.model("Video", videoSchema);
