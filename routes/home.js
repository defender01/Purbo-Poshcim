var express = require('express');
var router = express.Router();

const { newsModel, newsDetailsModel } = require("../models/news");
const videoModel = require("../models/video");

/* GET home page. */
router.get('/', async (req, res) => {
  let vidData = await (await videoModel.find({})).reverse();
  let newsData = await (await newsModel.find({})).reverse();
  res.render('home', { vidData, newsData});
});

router.get("/videos", async (req, res) => {
  await videoModel.find({}, (err, data) => {
    data = data.reverse()
    if (err) console.error(err);
    else res.render("videos", { data });
  });
});

router.get("/news", async (req, res) => {
  await newsModel.find({}, (err, data) => {
    data = data.reverse()
    if (err) console.error(err);
    else res.render("news", { data });
  });
});

router.get("/news/:id", async (req, res) => {
  let id = req.params.id
  let data = await newsModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "newsDetails",
    });
  res.render("newsDetails", { data });
});

router.get('/test',  (req, res) => {
  res.render('test');
});

module.exports = router;
