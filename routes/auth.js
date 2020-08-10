const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/userInfo");
const { checkNotAuthenticated } = require("../controllers/auth_helper");

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
router.get("/register", checkNotAuthenticated, (req, res) =>
  res.render("bloggerRegistration", {classes})
);

// Register
router.post("/register", (req, res) => {
  const {
    firstName,
    lastName,
    displayName,
    email,
    password,
    password2,
    birthDate,
    phoneNumber,
    nidNumber,
    birthCertificateNumber,
    passportNumber,
    gender,
  } = req.body;
  let errors = [];

  if (
    !firstName ||
    !lastName ||
    !displayName ||
    !email ||
    !password ||
    !password2 ||
    !birthDate ||
    !phoneNumber ||
    !(nidNumber || birthCertificateNumber || passportNumber) ||
    !gender
  ) {
    errors.push({ msg: "Please enter all required fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (phoneNumber.length < 11) {
    errors.push({ msg: "Phone number must be atleast 11 digits" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("registration", {
      classes,
      errors,
      firstName,
      lastName,
      displayName,
      email,
      birthDate,
      phoneNumber,
      nidNumber,
      gender,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("registration", {
          classes,
          errors,
          firstName,
          lastName,
          displayName,
          email,
          birthDate,
          phoneNumber,
          nidNumber,
          gender,
        });
      } else {
        const newUser = new User({
          name: {
            firstName: firstName,
            lastName: lastName,
            displayName: displayName,
          },
          email: email,
          password: password,
          birthDate: birthDate,
          phoneNumber: phoneNumber,
          nidNumber: nidNumber,
          gender: gender,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/auth/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

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
