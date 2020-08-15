const { newsModel, newsDetailsModel } = require("../models/news");
const videoModel = require("../models/video");
const { converToBdTime, getBdDate } = require("./adminFunctions");

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

async function getHome(req, res) {
  let newsData = {};
  // let dd = await newsModel.find({})
  // for(let i=0; i<dd.length; i++){
  //   if(dd[i].updated!== null|| dd[i].updated!=''){
  //     let timeOb =converToBdTime(dd[i].updated)
  //     await newsModel.findByIdAndUpdate(
  //       {_id:dd[i]._id},
  //       {
  //         bdFormatTime:{
  //           year: timeOb.year,
  //           month: timeOb.month,
  //           day: timeOb.day,
  //           hour: timeOb.hour,
  //           minute: timeOb.minute,
  //           timeString: getBdDate(dd[i].updated)
  //          }
  //       }
  //     )
  //   }
  //   else{
  //     console.log('no time found')
  //   }
  // }

  newsData["সাম্প্রতিক"] = await newsModel.find({ isRecent: true }).sort({created: -1}).limit(20);
  for (let i = 0; i < classes.length; i++) {
    newsData[classes[i]] = await newsModel.find({ class: classes[i] }).sort({created: -1}).limit(20);
  }
  let vidData = await videoModel.find({}).sort({created: -1}).limit(20);
  res.render("home", { classes, vidData, newsData });
}
async function getVideos(req, res) {
  data = await videoModel.find({}).sort({ created: -1 });
  res.render("videos", { classes, data });
}

async function getSectionNews(req, res) {
  let nClass = req.params.class;
  if (nClass == "সাম্প্রতিক") {
    data = await newsModel
      .find({
        isRecent: true,
      })
      .sort({ created: -1 });
  } else {
    data = await newsModel
      .find({
        class: nClass,
      })
      .sort({ created: -1 }); // sort({created: -1}); -1 is for descending order based on created
  }

  res.render("news", { classes, data, nClass });
}

async function getNewsDetails(req, res) {
  let id = req.params.id;
  let data = await newsModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "newsDetails",
    });

  // current view with this visit
  console.log(data.views + 1);

  await newsModel.findByIdAndUpdate(
    { _id: id },
    {
      views: data.views + 1,
    }
  );
  res.render("newsDetails", { classes, data });
}

module.exports = {
  getHome,
  getVideos,
  getSectionNews,
  getNewsDetails,
};
