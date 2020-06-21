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
  }
});

module.exports = mongoose.model("Video", videoSchema);
