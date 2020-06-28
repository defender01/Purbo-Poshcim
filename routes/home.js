var express = require("express");
var router = express.Router();

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
  "বিনোদন",
  "উদ্ভাবন",
  "মতামত",
  "কর্মসূচী",
];

/* GET home page. */
router.get("/", async (req, res) => {
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
  res.render("home", { classes, vidData, newsData });
});

router.get("/videos", async (req, res) => {
  await videoModel.find({}, (err, data) => {
    data = data.reverse();
    if (err) console.error(err);
    else res.render("videos", { classes, data });
  });
});


router.get("/news/:class", async (req, res) => {
  let nClass = req.params.class;
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

  res.render("news", { classes, data, nClass });
});

router.get("/newsDetails/:id", async (req, res) => {
  let id = req.params.id;
  let data = await newsModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "newsDetails",
    });
  res.render("newsDetails", { classes, data });
});

router.get("/test", (req, res) => {
  res.render("test", {classes});
});

module.exports = router;
