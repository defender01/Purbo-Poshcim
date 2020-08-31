const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/userInfo");
const Blogger = require("../models/blogger");
const { checkNotAuthenticated, registerBlogger } = require("../controllers/auth_helper");
const { checkNotNull, trimSpace, classes} = require("../controllers/functionCollection")

// const classes = [
//   "বাংলাদেশ",
//   "আন্তর্জাতিক",
//   "অর্থনীতি",     
//   "সাহিত্য",
//   "ক্যাম্পাস",
//   "শিক্ষা",    
//   "খেলা",
//   "বিজ্ঞান ও প্রযুক্তি",
//   "বিনোদন",
//   "উদ্ভাবন",
//   "মতামত",
//   "কর্মসূচী",
// ];


// Login Page
router.get("/login/:role", checkNotAuthenticated, (req, res) =>{
  let role = req.params.role
 res.render("adminLogin", {classes}) 
});
// Login
router.post("/login/:role", async (req, res, next) => {
  let role = req.params.role
  if(role == 'admin'){    
    passport.authenticate("adminLocal", {
      successRedirect: "/admin",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })(req, res, next);
  }
  else if(role == 'blogger'){    
    passport.authenticate("bloggerLocal", {
      successRedirect: "/admin",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })(req, res, next);
  }
  else if(role == 'journalist'){    
    passport.authenticate("journalistLocal", {
      successRedirect: "/admin",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })(req, res, next);
  }
  

});

// Register Page
router.get("/register/blogger", checkNotAuthenticated, (req, res) =>
  res.render("bloggerRegistration", {classes})
);

router.post("/register/blogger", registerBlogger);

// Logout
router.get("/logout/:role", (req, res) => {
  let role = req.params.role
  if (req.user) {
    req.logout();
    req.flash("success_msg", "You are logged out");
  } else {
    req.flash("error_msg", "You are not logged in");
  }
  if(role == 'admin')
    res.redirect("/auth/login/admin");
  else if(role == 'blogger')
    res.redirect("/auth/login/blogger");
  else if(role == 'journalist')
    res.redirect("/auth/login/journalist");
});

module.exports = router;
