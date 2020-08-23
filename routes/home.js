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

router.get("/newsDetails/:convertedTitle/:id", getNewsDetails);

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
