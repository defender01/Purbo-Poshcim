const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { newsModel, newsDetailsModel } = require("../models/news");
const videoModel = require("../models/video");

let classes = [
  "বাংলাদেশ",
  "আন্তর্জাতিক",
  "অর্থনীতি",
  "ক্যাম্পাস",
  "শিক্ষা",
  "কর্মসূচী",
  "খেলা",
  "বিনোদন",
  "উদ্ভাবন",
  "মতামত",
  "সাহিত্য",
];

const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../controllers/auth_helper");

router.get("/", checkAuthenticated, (req, res) => {
  let displayName = req.user.name.displayName;
  res.render("admin", { displayName });
});

router.get("/news", checkAuthenticated, async (req, res) => {
  let displayName = req.user.name.displayName;
  await newsModel.find({}, (err, data) => {
    data = data.reverse()
    if (err) console.error(err);
    else res.render("adminNews", { data, displayName });
  });
});

router.get("/news/:id", async (req, res) => {
  let id = req.params.id;
  let data = await newsModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "newsDetails",
    });
  res.render("adminNewsDetails", { data });
});

router.get("/createNews", checkAuthenticated, (req, res) => {
  let displayName = req.user.name.displayName;
  res.render("adminCreateNews", { displayName, classes });
});

router.post("/createNews", checkAuthenticated, async (req, res) => {
  let data = req.body;
  let details = new newsDetailsModel({
    _id: new mongoose.Types.ObjectId(),
    details: data.newsDetails,
  });

  let news = new newsModel({
    _id: new mongoose.Types.ObjectId(),
    title: data.title,
    class: data.class,
    newsDetails: details._id,
    photoUrl: data.photoUrl,
  });

  await details.save();
  await news.save();
  res.redirect("/admin/news");
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
  res.render("adminUpdateNews", { data, classes, displayName });
});

router.post("/news/update/:id/:dId", checkAuthenticated, async (req, res) => {
  let data = req.body;
  let displayName = req.user.name.displayName;
  let id = req.params.id;
  let dId = req.params.dId;
  await newsModel.findOneAndUpdate(
    { _id: id },
    {
      title: data.title,
      class: data.class,
      photoUrl: data.photoUrl,
    }
  );
  await newsDetailsModel.findOneAndUpdate(
    {
      _id: dId,
    },
    { details: data.newsDetails }
  );

  res.redirect("/admin/news");
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
    else res.render("adminVideos", { data, displayName });
  });
});

router.get("/createVideo", checkAuthenticated, (req, res) => {
  let displayName = req.user.name.displayName;
  res.render("adminCreateVideo", { displayName, classes });
});

router.post("/createVideo", checkAuthenticated, async (req, res) => {
  let data = req.body;
  let news = new videoModel({
    title: data.title,
    class: data.class,
    videoUrl: data.videoUrl,
  });

  data = await news.save();
  res.redirect("/admin/videos");
});

router.get("/video/update/:id", checkAuthenticated, async (req, res) => {
  let displayName = req.user.name.displayName;
  let id = req.params.id;

  let data = await videoModel.findOne({ _id: id });
  res.render("adminUpdateVideo", { data, classes, displayName });
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
