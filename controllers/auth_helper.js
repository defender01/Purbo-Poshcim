const { checkNotNull, trimSpace, classes} = require("./functionCollection")



function registerBlogger(req, res) {

  // trimming each value in req.body
  req.body = trimSpace(req.body)

  console.log(req.body)


  const {
    name,
    email,
    phoneNumber,
    password,
    password2,
  } = req.body;
  let errors = [];

  if (
    !name ||
    !email ||
    !phoneNumber ||
    !password ||
    !password2
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
    res.render("bloggerRegistration", {
      classes,
      errors,
      name,
      email,      
      phoneNumber,
    });
  } else {
    Blogger.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("bloggerRegistration", {
          classes,
          errors,
          name,
          email,      
          phoneNumber,
        });
      } else {
        const newUser = new Blogger({
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          password: password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // newUser
            //   .save()
            //   .then((user) => {
            //     req.flash(
            //       "success_msg",
            //       "You are now registered and can log in"
            //     );
            //     res.redirect("/auth/login");
            //   })
            //   .catch((err) => console.log(err));
          });
        });
      }
    });
  }
}

function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource')
  res.redirect('/auth/login/admin');
}
function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.flash('success_msg', 'You are logged in')
  res.redirect('/admin');      
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  registerBlogger
}
