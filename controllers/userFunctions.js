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

async function getHome (req, res){
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
  }
async function getVideos(req, res){
    await videoModel.find({}, (err, data) => {
        data = data.reverse();
        if (err) console.error(err);
        else res.render("videos", { classes, data });
    });
}

async function getSectionNews (req, res){
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
  }

async function getNewsDetails (req, res) {
    let id = req.params.id;
    let data = await newsModel
        .findOne({
        _id: id,
        })
        .populate({
        path: "newsDetails",
        });

    let timeObj =converToBdTime(data.created)  
    console.log({timeObj})

    res.render("newsDetails", { classes, data });
}
function converToBdTime(timeOb){
    return {
        year: mapToBdNumber(timeOb.getFullYear()),
        month: mapToBdNumber(timeOb.getMonth() + 1),
        day: mapToBdNumber(timeOb.getUTCDate()),
        hour: mapToBdNumber(timeOb.getUTCHours()),
        minute: mapToBdNumber(timeOb.getUTCMinutes()),
    }     
}
mapToBdNumber(5)
function mapToBdNumber(n){
    let str = n.toString()
    let ns =''
    mp={
        '0':'০',
        '1':'১',
        '2':'২',
        '3':'৩',
        '4':'৪',
        '5':'৫',
        '6':'৬',
        '7':'৭',
        '8':'৮',
        '9':'৯'
    }
    for(let i=0; i<str.length; i++){
        ns+=mp[str[i]]
    }
    return ns
}
module.exports = {
    getHome,
    getVideos,
    getSectionNews,
    getNewsDetails
}