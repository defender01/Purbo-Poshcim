const express = require("express");
const router = express.Router();
const {newsModel} = require("../models/news")
const {
  getHome,
  getVideos,
  getSectionNews,
  getNewsDetails
}= require('../controllers/userFunctions')

const { checkNotNull, trimSpace, classes} = require("../controllers/functionCollection")


/* GET home page. */
router.get("/", getHome);

router.get("/videos", getVideos);

router.get("/news/:class", getSectionNews);

// this only redirects to the new url which is given next
router.get("/newsDetails/:id", async (req, res)=>{
  let id = req.params.id
  let data = await newsModel.findOne({ _id: id});
  res.redirect('/newsDetails/'+data._id+'/'+data.title.trim().replace(/\s/g,'-'))
});
router.get("/newsDetails/:id/:convertedTitle", getNewsDetails);

router.get('/about-us', (req, res)=>{
  res.render('aboutUs', {classes})
})
router.get('/terms-and-conditions', (req, res)=>{
  res.render('termsAndConditions', {classes})
})
router.get('/privacy-policy', (req, res)=>{
  res.render('privacyPolicy', {classes})
})
router.get('/contact-us', (req, res)=>{
  res.render('contactUs', {classes})
})
router.get('/ad', (req, res)=>{
  res.render('ad', {classes})
})

router.get('/members', (req, res) => {
  let staffs = {
    names: [ 'ফৌজিয়া আহমেদ', 'সাজ্জাদ হোসাইন', 'পলাশ দেব রায়','রায়হান শেইখ', 'মোঃ আবু তালহা', 'মোঃ সাগর ফকির', 'ইমামুল ইসলাম', 'পবিত্র পাল', 'আফরুনা সুপ্তি', 'তানভীর কায়সার', 'রোমানা আক্তার শান্তা', 'জাহান লুবনা'],
    imgFiles: ['Fouzia_Ahmed.jpg', 'Sazzad_Hossain.jpeg', 'Palash_Deb_Ray.jpg', 'Rayhan_Sheik.jpg', 'Md_Abu_Talha.jpg', 'Md_Sagar_Fokir.jpg', 'Imamul_Islam.jpg', 'Pabitra_pal.jpg', 'Afruna_Supti.jpg', 'Tanveer_Kaiser.jpeg', 'Romana_Aktar_Shanta.jpg', 'Jahan_Lubna.jpeg'],
    roles: ['বার্তা সম্পাদক','উপ সম্পাদক', 'সাংবাদিক','সাংবাদিক',  'সাংবাদিক', 'সাংবাদিক', 'সাংবাদিক', 'সাংবাদিক', 'উপস্থাপক', 'উপস্থাপক', 'উপস্থাপক', 'গ্রাফিক্স ডিজাইনার' ],
    mails: ['', '', '', '', '', '', '', '', '', '', '', 'jahanlubnacou54@gmail.com']
  }
  res.render('staff', {classes,staffs})
})

router.get("/test", (req, res) => {
  res.render("test", {classes});
});

module.exports = router;
