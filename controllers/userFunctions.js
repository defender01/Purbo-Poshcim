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

  newsData["সাম্প্রতিক"] = await newsModel
    .find({ isRecent: true })
    .sort({ created: -1 })
    .limit(20);
  for (let i = 0; i < classes.length; i++) {
    newsData[classes[i]] = await newsModel
      .find({ class: classes[i] })
      .sort({ created: -1 })
      .limit(20);
  }
  let vidData = await videoModel.find({}).sort({ created: -1 }).limit(20);
  res.render("home", { classes, vidData, newsData });
}
async function getVideos(req, res) {
  data = await videoModel.find({}).sort({ created: -1 });
  res.render("videos", { classes, data });
}

async function getSectionNews(req, res) {
  let nClass = req.params.class;
  const LIMIT = 18;
  let { page } = req.query;
  page = parseInt(typeof page != "undefined" ? page : 1);

  let totalItems = 0;

  if (nClass == "সাম্প্রতিক") {
    totalItems = await newsModel.countDocuments({
      isRecent: true,
    });

    data = await newsModel
      .find({
        isRecent: true,
      })
      .sort({ created: -1 })
      .limit(LIMIT)
      .skip(LIMIT * (page - 1)); // sort({created: -1}); -1 is for descending order based on created;
      
  } else {
    totalItems = await newsModel.countDocuments({
      class: nClass,
    });

    data = await newsModel
      .find({
        class: nClass,
      })
      .sort({ created: -1 })
      .limit(LIMIT)
      .skip(LIMIT * (page - 1)); // sort({created: -1}); -1 is for descending order based on created
  }

  let paginationUrl = req.originalUrl.toString();
  if (paginationUrl.includes(`page=`))
    paginationUrl = paginationUrl.replace(`page=${page}`, "page=");
  else {
    paginationUrl = paginationUrl.includes("?")
      ? `${paginationUrl}&page=`
      : `${paginationUrl}?page=`;
  }

  res.render("news", {
    classes,
    data,
    nClass,
    currentPage: page,
    hasNextPage: page * LIMIT < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / LIMIT),
    URL: paginationUrl,
  });
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

  newsData = await newsModel
    .find({ class: data.class })
    .sort({ created: -1 })
    .limit(15);

  res.render("newsDetails", { classes, data, newsData });
}

module.exports = {
  getHome,
  getVideos,
  getSectionNews,
  getNewsDetails,
};
