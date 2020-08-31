
const mongoose = require("mongoose");
const { newsModel, newsDetailsModel } = require("../models/news");
const videoModel = require("../models/video");

const { checkNotNull, trimSpace, classes} = require("../controllers/functionCollection")



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
    let displayName = req.user.name;
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
    let displayName = req.user.name;
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
    let displayName = req.user.name;
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
    let displayName = req.user.name;
    res.render("adminCreateNews", { classes, displayName });
  }

  async function postCreateNews (req, res){
    let data = req.body;
    // res.send(data)
    let timeNow = new Date()
    let timeOb =converToBdTime(timeNow)
    let details = new newsDetailsModel({
      _id: new mongoose.Types.ObjectId(),
      details: data.newsDetails
    });
  
    let news = new newsModel({
      _id: new mongoose.Types.ObjectId(),
      title: data.title,
      class: data.class,
      isRecent: data.recent=='checked',
      bdFormatTime:{
        year: timeOb.year,
        month: timeOb.month,
        day: timeOb.day,
        hour: timeOb.hour,
        minute: timeOb.minute,
        timeString: timeOb.day+'-'+timeOb.month+'-'+timeOb.year
       },
      newsDetails: details._id,
      photoUrl: data.photoUrl,
      author: data.author,
      updated: timeNow
    });
  
    await details.save();
    await news.save();
    res.redirect("/admin/newsDetails/"+news._id+'/'+news.title.trim().replace(/\s/g,'-'));
  }

  async function getUpdateNews (req, res) {
    let displayName = req.user.name;
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
    let displayName = req.user.name;
    let id = req.params.id;
    let dId = req.params.dId;
    await newsModel.findOneAndUpdate(
      { _id: id },
      {
        title: data.title,
        class: data.class,
        isRecent: data.recent=='checked',
        photoUrl: data.photoUrl,
        author: data.author
      }
    );
    await newsDetailsModel.findOneAndUpdate(
      {
        _id: dId,
      },
      { details: data.newsDetails }
    );
  
    res.redirect("/admin/newsDetails/"+id+'/'+data.title.trim().replace(/\s/g,'-'));
  }

  async function deleteNews (req, res){
    let displayName = req.user.name;
    let id = req.params.id;
    let dId = req.params.dId;
  
    await newsModel.deleteOne({ _id: id });
    await newsDetailsModel.deleteOne({ _id: dId });
    res.redirect("back");
  }

  async function getVideos (req, res) {
    let displayName = req.user.name;
    await videoModel.find({}, (err, data) => {
      data = data.reverse()
      if (err) console.error(err);
      else res.render("adminVideos", { classes, data, displayName });
    });
  }

  function getCreateVideo(req, res) {
    let displayName = req.user.name;
    res.render("adminCreateVideo", { classes, displayName });
  }

  async function postCreateVideo (req, res){
    let data = req.body;
    let news = new videoModel({
      title: data.title,
      class: data.class,
      videoUrl: data.videoUrl,
      updated: new Date()
    });
  
    data = await news.save();
    res.redirect("/admin/videos");
  }

  async function getUpdateVideo (req, res) {
    let displayName = req.user.name;
    let id = req.params.id;
  
    let data = await videoModel.findOne({ _id: id });
    res.render("adminUpdateVideo", { classes, data, displayName });
  }

  async function postUpdateVideo (req, res) {
    let data = req.body;
    let displayName = req.user.name;
    let id = req.params.id;
    await videoModel.findOneAndUpdate(
      { _id: id },
      {
        title: data.title,
        class: data.class,
        videoUrl: data.videoUrl,
        updated: new Date()
      },
      (err, data) => {
        if (err) console.error(err);
        else res.redirect("/admin/videos");
      }
    );
  }

  async function deleteVideo (req, res) {
    let displayName = req.user.name;
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