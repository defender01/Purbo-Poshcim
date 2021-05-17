const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");

const { newsModel, newsDetailsModel } = require("../models/news");
const videoModel = require("../models/video");
const {
  checkNotNull,
  trimSpace,
  classes,
} = require("../controllers/functionCollection");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

// // Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: './public/images/newsImages/',
//   filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("newsPhoto");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

function converToBdTime(createTime) {
  return {
    year: mapToBdNumber(createTime.getFullYear()),
    month: mapToBdNumber(createTime.getMonth() + 1),
    day: mapToBdNumber(createTime.getUTCDate()),
    hour: mapToBdNumber(createTime.getUTCHours()),
    minute: mapToBdNumber(createTime.getUTCMinutes()),
  };
}

function mapToBdNumber(n) {
  let str = n.toString();
  let ns = "";
  mp = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };
  for (let i = 0; i < str.length; i++) {
    ns += mp[str[i]];
  }
  return ns;
}

function getBdDate(createTime) {
  let timeObj = converToBdTime(createTime);
  return timeObj.day + "-" + timeObj.month + "-" + timeObj.year;
}

async function getHome(req, res) {
  let displayName = req.user.name;
  let newsData = {};
  await newsModel.find({ isRecent: true }, (err, result) => {
    if (err) console.error(err);
    newsData["সাম্প্রতিক"] = result.reverse();
  });
  for (let i = 0; i < classes.length; i++) {
    await newsModel.find({ class: classes[i] }, (err, result) => {
      if (err) console.error(err);
      newsData[classes[i]] = result.reverse();
    });
  }
  let vidData = (await videoModel.find({})).reverse();
  res.render("admin", { classes, vidData, newsData, displayName });
}

async function getSectionNews(req, res) {
  let displayName = req.user.name;
  let nClass = req.params.class;
  let data;
  const LIMIT = 20;
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

  res.render("adminNews", {
    classes,
    data,
    nClass,
    displayName,
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
  let displayName = req.user.name;
  let id = req.params.id;
  let data = await newsModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "newsDetails",
    });
  res.render("adminNewsDetails", { classes, data, displayName });
}

function getCreateNews(req, res) {
  let displayName = req.user.name;
  res.render("adminCreateNews", { classes, displayName });
}

async function postCreateNews(req, res) {
  let displayName = req.user.name;
  let data;

  errors = [];
  upload(req, res, async (err) => {
    let stored, photoFile
    data = req.body;
    console.log('received data from req.body:'+{data});
  
    if (err) {
      console.log({ err });
      errors.push({ msg: err.message });
    } else {
      if (req.file != undefined) {
        console.log(req.file);

        //  save file
        let albumName = "newsPhoto/"+data.class
        let fileName = `${req.file.fieldname}${Date.now()}${path.extname(req.file.originalname)}`;
        console.log({fileName});
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${albumName}/${fileName}`,
          Body: req.file.buffer,
          ACL: "public-read"
        };

        try {

          //  upload new file
          stored = await s3.upload(params).promise();
          console.log({stored});

          photoFile = {
            Bucket : stored.Bucket,
            Key : stored.Key,
            Location : stored.Location,
          }

        } catch (err) {
          console.log(err);
          errors.push(err.message);
        }
      }
    }
    console.log({errors});

    if (errors.length > 0) {
      console.log({ errors });
      res.render("adminCreateNews", { classes, displayName, errors, data });
    }
    else{
      // save news details
      let timeNow = new Date()
      let timeOb =converToBdTime(timeNow)
      let details = new newsDetailsModel({
        _id: new mongoose.Types.ObjectId(),
        details: data.newsDetails
      });
    
      let news = new newsModel({
        _id: new mongoose.Types.ObjectId(),
        title: data.title,
        class: data.class,
        isRecent: data.isRecent=='checked',
        bdFormatTime:{
          year: timeOb.year,
          month: timeOb.month,
          day: timeOb.day,
          hour: timeOb.hour,
          minute: timeOb.minute,
          timeString: timeOb.day+'-'+timeOb.month+'-'+timeOb.year
        },
        newsDetails: details._id,
        photoUrl: stored!=undefined? stored.Location:data.photoUrl,
        photoFile: photoFile,
        author: data.author,
        updated: timeNow
      });

      console.log({news})
      
      
      await details.save();
      await news.save();
      res.redirect("/admin/newsDetails/"+news._id+'/'+news.title.trim().replace(/\s/g,'-'));
    }    
    
  });
 
}

async function getUpdateNews(req, res) {
  let displayName = req.user.name;
  let id = req.params.id;

  let data = await newsModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "newsDetails",
    });
  res.render("adminUpdateNews", { classes, data, displayName });
}

async function postUpdateNews(req, res) {
  let data 
  let displayName = req.user.name;
  let id = req.params.id;
  let dId = req.params.dId;

  errors = [];
  upload(req, res, async (err) => {
    let stored, photoFile
    data = req.body;
    console.log('data received from req.body:'+{data});

    let newsData = 
        await newsModel.findOne({
                                  _id: id,
                                })
                                .populate({
                                  path: "newsDetails",
                                });
    newsData.title= data.title
    newsData.class= data.class
    newsData.isRecent= data.isRecent=='checked'
    newsData.photoUrl= stored!=undefined? stored.Location:data.photoUrl
    newsData.author= data.author

    photoFile = newsData.photoFile
  
    if (err) {
      console.log({ err });
      errors.push({ msg: err.message });
    } else {
      if (req.file != undefined) {
        console.log(req.file);

        //  save file
        let albumName = "newsPhoto/"+data.class
        let fileName = `${req.file.fieldname}${Date.now()}${path.extname(req.file.originalname)}`;
        console.log({fileName});
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${albumName}/${fileName}`,
          Body: req.file.buffer,
          ACL: "public-read"
        };

        try {
          // delete existiog file
          if(typeof newsData.photoFile.Bucket!=='undefined'){
            let dltParams = {
              Bucket: newsData.photoFile.Bucket, 
              Key: newsData.photoFile.Key
            };
            await s3.deleteObject(dltParams).promise();
          }

          //  upload new file
          stored = await s3.upload(params).promise();
          console.log({stored});
          photoFile = {
            Bucket : stored.Bucket,
            Key : stored.Key,
            Location : stored.Location,
          }

        } catch (err) {
          console.log(err);
          errors.push(err.message);
        }
      }
    }
    console.log({errors});

    if (errors.length > 0) {
      console.log({ errors });
      res.render("adminUpdateNews", { classes, displayName, errors, data:newsData });
    }
    else{
      // update news data

      let news = await newsModel.findOneAndUpdate(
        { _id: id },
        {
          title: data.title,
          class: data.class,
          isRecent: data.isRecent=='checked',
          photoUrl: stored!=undefined? stored.Location:data.photoUrl,
          author: data.author,
          photoFile: photoFile
        }
      );
      await newsDetailsModel.findOneAndUpdate(
        {
          _id: dId,
        },
        { details: data.newsDetails }
      );

      console.log({news})   
      
      res.redirect("/admin/newsDetails/" + id + "/" + data.title.trim().replace(/\s/g, "-"));
    }    
    
  });

}

async function deleteNews(req, res) {
  let displayName = req.user.name;
  let id = req.params.id;
  let dId = req.params.dId;

  let newsData = await newsModel.findOne({_id:id})

  try {
    // delete existiog file
    if(typeof newsData.photoFile.Bucket!=='undefined'){
      let dltParams = {
        Bucket: newsData.photoFile.Bucket, 
        Key: newsData.photoFile.Key
      };
      await s3.deleteObject(dltParams).promise();
    }
     await newsModel.deleteOne({ _id: id });
     await newsDetailsModel.deleteOne({ _id: dId });

  } catch (err) {
    console.log(err);
    res.send(err)
  }
  
  res.redirect("back");
}

async function getVideos(req, res) {
  let displayName = req.user.name;
  await videoModel.find({}, (err, data) => {
    data = data.reverse();
    if (err) console.error(err);
    else res.render("adminVideos", { classes, data, displayName });
  });
}

function getCreateVideo(req, res) {
  let displayName = req.user.name;
  res.render("adminCreateVideo", { classes, displayName });
}

async function postCreateVideo(req, res) {
  let data = req.body;
  let news = new videoModel({
    title: data.title,
    class: data.class,
    videoUrl: data.videoUrl,
    updated: new Date(),
  });

  data = await news.save();
  res.redirect("/admin/videos");
}

async function getUpdateVideo(req, res) {
  let displayName = req.user.name;
  let id = req.params.id;

  let data = await videoModel.findOne({ _id: id });
  res.render("adminUpdateVideo", { classes, data, displayName });
}

async function postUpdateVideo(req, res) {
  let data = req.body;
  let displayName = req.user.name;
  let id = req.params.id;
  await videoModel.findOneAndUpdate(
    { _id: id },
    {
      title: data.title,
      class: data.class,
      videoUrl: data.videoUrl,
      updated: new Date(),
    },
    (err, data) => {
      if (err) console.error(err);
      else res.redirect("/admin/videos");
    }
  );
}

async function deleteVideo(req, res) {
  let displayName = req.user.name;
  let id = req.params.id;

  await videoModel.deleteOne({ _id: id });
  res.redirect("back");
}

module.exports = {
  converToBdTime,
  mapToBdNumber,
  getBdDate,
  getHome,
  getSectionNews,
  getNewsDetails,
  postCreateNews,
  getCreateNews,
  getUpdateNews,
  postUpdateNews,
  deleteNews,
  getVideos,
  getCreateVideo,
  postCreateVideo,
  getUpdateVideo,
  postUpdateVideo,
  deleteVideo,
};
