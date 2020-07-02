const express = require("express");
const router = express.Router();
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

const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../controllers/auth_helper");

router.get("/", checkAuthenticated, async (req, res) => {
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
});

router.get("/news/:class", checkAuthenticated, async (req, res) => {
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
});

router.get("/newsDetails/:id", checkAuthenticated, async (req, res) => {
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
});

router.get("/createNews", checkAuthenticated, (req, res) => {
  let displayName = req.user.name.displayName;
  res.render("adminCreateNews", { classes, displayName });
});

router.post("/createNews", checkAuthenticated, async (req, res) => {
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
});

router.get("/news/update/:id", checkAuthenticated, async (req, res) => {
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
});

router.post("/news/update/:id/:dId", checkAuthenticated, async (req, res) => {  
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
});

router.get("/news/delete/:id/:dId", checkAuthenticated, async (req, res) => {
  let displayName = req.user.name.displayName;
  let id = req.params.id;
  let dId = req.params.dId;

  await newsModel.deleteOne({ _id: id });
  await newsDetailsModel.deleteOne({ _id: dId });
  res.redirect("back");
});

router.get("/videos", checkAuthenticated, async (req, res) => {
  let displayName = req.user.name.displayName;
  await videoModel.find({}, (err, data) => {
    data = data.reverse()
    if (err) console.error(err);
    else res.render("adminVideos", { classes, data, displayName });
  });
});

router.get("/createVideo", checkAuthenticated, (req, res) => {
  let displayName = req.user.name.displayName;
  res.render("adminCreateVideo", { classes, displayName });
});

router.post("/createVideo", checkAuthenticated, async (req, res) => {
  let data = req.body;
  let news = new videoModel({
    title: data.title,
    class: data.class,
    videoUrl: data.videoUrl,
    created: Date.now()
  });

  data = await news.save();
  res.redirect("/admin/videos");
});

router.get("/video/update/:id", checkAuthenticated, async (req, res) => {
  let displayName = req.user.name.displayName;
  let id = req.params.id;

  let data = await videoModel.findOne({ _id: id });
  res.render("adminUpdateVideo", { classes, data, displayName });
});

router.post("/video/update/:id", checkAuthenticated, async (req, res) => {
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
});

router.get("/video/delete/:id", checkAuthenticated, async (req, res) => {
  let displayName = req.user.name.displayName;
  let id = req.params.id;

  await videoModel.deleteOne({ _id: id });
  res.redirect("back");
});

module.exports = router;
