var express = require('express');
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var flash = require('connect-flash')
var session = require("express-session")
var passport = require("passport")
const statsModel = require("./models/stats");
const {redirectUrl} =  require("./controllers/functionCollection")

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config()
// Passport Config
require('./controllers/passport').passportForAdmin(passport)
require('./controllers/passport').passportForBlogger(passport)
require('./controllers/passport').passportForAdmin(passport)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Express session
app.use(
  session({
    secret: "secret care",
    resave: true,
    saveUninitialized: true
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

mongoose
  .connect(
    "mongodb+srv://defender:161034@cluster0-5dm6t.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("connected to database!!"))
  .catch(err => console.log(err))

  // Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})


// assets is for accessing css,js files
app.use("/assets", express.static(__dirname + "/public"))
// all used photos are in resources
app.use("/resources", express.static(__dirname + "/resources"))

async function increaseVisit(req, res, next){
   let data = await statsModel.findOne({})
  //  console.log({data})
   let count = data.visit+1
   await statsModel.findOneAndUpdate(
     {},
     {
       visit: count
     }
   )
   data = await statsModel.findOne({})
  //  console.log({data})
  next()
}

app.use('/',increaseVisit, redirectUrl , require('./routes/home'));
app.use('/users',increaseVisit, redirectUrl, require('./routes/users'));
app.use("/auth",increaseVisit, redirectUrl, require("./routes/auth.js"))
app.use("/admin",increaseVisit, redirectUrl, require("./routes/admin.js"))



var PORT = process.env.PORT || 4000
// app.listen(PORT)
app.listen(PORT, () => {
  console.log('Express server listening on port', PORT)
})
