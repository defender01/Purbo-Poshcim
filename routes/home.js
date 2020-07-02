var express = require("express");
var router = express.Router();

const {
  getHome,
  getVideos,
  getSectionNews,
  getNewsDetails
}= require('../controllers/userFunctions')

/* GET home page. */
router.get("/", getHome);

router.get("/videos", getVideos);

router.get("/news/:class", getSectionNews);

router.get("/newsDetails/:id", getNewsDetails);

router.get("/test", (req, res) => {
  res.render("test", {classes});
});

module.exports = router;
