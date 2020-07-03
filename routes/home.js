var express = require("express");
var router = express.Router();

const {
  getHome,
  getVideos,
  getSectionNews,
  getNewsDetails
}= require('../controllers/userFunctions')

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


/* GET home page. */
router.get("/", getHome);

router.get("/videos", getVideos);

router.get("/news/:class", getSectionNews);

router.get("/newsDetails/:id", getNewsDetails);

router.get('/aboutUs', (req, res)=>{
  res.render('aboutUs', {classes})
})
router.get('/termsAndConditions', (req, res)=>{
  res.render('termsAndConditions', {classes})
})
router.get('/privacyPolicy', (req, res)=>{
  res.render('privacyPolicy', {classes})
})
router.get('/contactUs', (req, res)=>{
  res.render('contactUs', {classes})
})
router.get('/ad', (req, res)=>{
  res.render('ad', {classes})
})


router.get("/test", (req, res) => {
  res.render("test", {classes});
});

module.exports = router;
