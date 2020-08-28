const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new mongoose.Schema({
  title: {
      type:String
  },
  class: {
    type: String
  },
  newsDetails: {type: Schema.Types.ObjectId, ref: 'NewsDetails'},
  photoUrl:{
      type:String
  },
  updated: { 
    type: Date, 
  },
  created: { 
    type: Date, 
    default: Date.now
  },
  bdFormatTime:{
    year: String,
    month: String,
    day: String,
    hour: String,
    minute: String,
    timeString: String,
  },
  isRecent: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  writer: String
});

const newsDetailsSchema = new mongoose.Schema({
  details: {
      type:String,
  },
  updated: { 
    type: Date, 
    default: Date.now
  }
});

exports.newsModel = mongoose.model("News", newsSchema);
exports.newsDetailsModel = mongoose.model("NewsDetails", newsDetailsSchema);
