
const mongoose = require("mongoose");
const { newsModel, newsDetailsModel } = require("../models/news");
const videoModel = require("../models/video");

const classes = [
  "বাংলাদেশ",
  "আন্তর্জাতিক",
  "অর্থনীতি",     
  "সাহিত্য",
  "ক্যাম্পাস",
  "শিক্ষা",    
  "খেলা",
  "বিজ্ঞান ও প্রযুক্তি",
  "বিনোদন",
  "উদ্ভাবন",
  "মতামত",
  "কর্মসূচী",
];



function converToBdTime(createTime){
    return {
        year: mapToBdNumber(createTime.getFullYear()),
        month: mapToBdNumber(createTime.getMonth() + 1),
        day: mapToBdNumber(createTime.getUTCDate()),
        hour: mapToBdNumber(createTime.getUTCHours()),
        minute: mapToBdNumber(createTime.getUTCMinutes()),
    }     
}

function mapToBdNumber(n){
    let str = n.toString()
    let ns =''
    mp={
        '0':'০',
        '1':'১',
        '2':'২',
        '3':'৩',
        '4':'৪',
        '5':'৫',
        '6':'৬',
        '7':'৭',
        '8':'৮',
        '9':'৯'
    }
    for(let i=0; i<str.length; i++){
        ns+=mp[str[i]]
    }
    return ns
}

function getBdDate(createTime){
    let timeObj = converToBdTime(createTime)
    return timeObj.day+'-'+timeObj.month+'-'+timeObj.year
}

async function getHome (req, res){
    let displayName = req.user.name.displayName;
    let newsData = {}
    await newsModel.find({isRecent: true}, (err, result) => {
      if (err) console.error(err);
      newsData['সাম্প্রতিক'] = result.reverse();
    });
    for(let i=0; i< classes.length; i++){        
      await newsModel.find({class: classes[i]}, (err, result) => {
        if (err) console.error(err);
        newsData[classes[i]] = result.reverse();
      }); 
    }
    let vidData = (await videoModel.find({})).reverse();
    res.render("admin", { classes, vidData, newsData,  displayName });
  }

  async function getSectionNews (req, res){
    let displayName = req.user.name.displayName;
    let nClass = req.params.class;
    let data;
    if(nClass == 'সাম্প্রতিক'){
      data = await newsModel
      .find({
        isRecent: true,
      }); 
    }
    else{
      data = await newsModel
      .find({
        class: nClass,
      });    
    }    
    data = data.reverse()
  
    res.render("adminNews", { classes, data, nClass, displayName });
  }

  async function getNewsDetails (req, res){
    let displayName = req.user.name.displayName;
    let id = req.params.id;
    let data = await newsModel
      .findOne({
        _id: id,
      })
      .populate({
        path: "newsDetails",
      });
    res.render("adminNewsDetails", { classes, data, displayName });
  }

  function getCreateNews(req, res) {
    let displayName = req.user.name.displayName;
    res.render("adminCreateNews", { classes, displayName });
  }

  async function postCreateNews (req, res){
    let data = req.body;
    // res.send(data)
    let details = new newsDetailsModel({
      _id: new mongoose.Types.ObjectId(),
      details: data.newsDetails
    });
  
    let news = new newsModel({
      _id: new mongoose.Types.ObjectId(),
      title: data.title,
      class: data.class,
      isRecent: data.recent=='checked',
      newsDetails: details._id,
      photoUrl: data.photoUrl,
      created: Date.now()
    });
  
    await details.save();
    await news.save();
    res.redirect("/admin");
  }

  async function getUpdateNews (req, res) {
    let displayName = req.user.name.displayName;
    let id = req.params.id;
  
    let data = await newsModel
      .findOne({
        _id: id,
      })
      .populate({
        path: "newsDetails",
      });
    res.render("adminUpdateNews", { classes, data,  displayName });
  }

  async function postUpdateNews (req, res) {  
    let data = req.body;
    console.log(data.recent=='checked')
    let displayName = req.user.name.displayName;
    let id = req.params.id;
    let dId = req.params.dId;
    await newsModel.findOneAndUpdate(
      { _id: id },
      {
        title: data.title,
        class: data.class,
        isRecent: data.recent=='checked',
        photoUrl: data.photoUrl,
      }
    );
    await newsDetailsModel.findOneAndUpdate(
      {
        _id: dId,
      },
      { details: data.newsDetails }
    );
  
    res.redirect("/admin/newsDetails/"+id);
  }

  async function deleteNews (req, res){
    let displayName = req.user.name.displayName;
    let id = req.params.id;
    let dId = req.params.dId;
  
    await newsModel.deleteOne({ _id: id });
    await newsDetailsModel.deleteOne({ _id: dId });
    res.redirect("back");
  }

  async function getVideos (req, res) {
    let displayName = req.user.name.displayName;
    await videoModel.find({}, (err, data) => {
      data = data.reverse()
      if (err) console.error(err);
      else res.render("adminVideos", { classes, data, displayName });
    });
  }

  function getCreateVideo(req, res) {
    let displayName = req.user.name.displayName;
    res.render("adminCreateVideo", { classes, displayName });
  }

  async function postCreateVideo (req, res){
    let data = req.body;
    let news = new videoModel({
      title: data.title,
      class: data.class,
      videoUrl: data.videoUrl,
      created: Date.now()
    });
  
    data = await news.save();
    res.redirect("/admin/videos");
  }

  async function getUpdateVideo (req, res) {
    let displayName = req.user.name.displayName;
    let id = req.params.id;
  
    let data = await videoModel.findOne({ _id: id });
    res.render("adminUpdateVideo", { classes, data, displayName });
  }

  async function postUpdateVideo (req, res) {
    let data = req.body;
    let displayName = req.user.name.displayName;
    let id = req.params.id;
    await videoModel.findOneAndUpdate(
      { _id: id },
      {
        title: data.title,
        class: data.class,
        videoUrl: data.videoUrl,
      },
      (err, data) => {
        if (err) console.error(err);
        else res.redirect("/admin/videos");
      }
    );
  }

  async function deleteVideo (req, res) {
    let displayName = req.user.name.displayName;
    let id = req.params.id;
  
    await videoModel.deleteOne({ _id: id });
    res.redirect("back");
  }

  module.exports = {
    converToBdTime,
    mapToBdNumber,
    getBdDate,
    getHome,
    getSectionNews,
    getNewsDetails,
    postCreateNews,
    getCreateNews,
    getUpdateNews,
    postUpdateNews,
    deleteNews,
    getVideos,
    getCreateVideo,
    postCreateVideo,
    getUpdateVideo,
    postUpdateVideo,
    deleteVideo,
}