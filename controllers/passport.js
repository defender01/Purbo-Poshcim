const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/userInfo');

module.exports = {
  passportForAdmin: (passport) => {
  passport.use('adminLocal',
    new LocalStrategy({ usernameField: 'emailOrPhone' }, (emailOrPhone, password, done) => {
      // Match user
      User.findOne({
        // email: email
        // email: emailOrPhone
        $or: [ { email: emailOrPhone }, { phoneNumber: emailOrPhone } ] 
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email or phone no is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) { 
    done(null, user.id);
  }); 

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
},
passportForBlogger: (passport) => {
  passport.use('bloggerLocal',
    new LocalStrategy({ usernameField: 'emailOrPhone' }, (emailOrPhone, password, done) => {
      // Match user
      User.findOne({
        // email: email
        // email: emailOrPhone
        $or: [ { email: emailOrPhone }, { phoneNumber: emailOrPhone } ] 
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email or phone no is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  }); 

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
},
passportForJournalist: (passport) => {
  passport.use('journalistLocal',
    new LocalStrategy({ usernameField: 'emailOrPhone' }, (emailOrPhone, password, done) => {
      // Match user
      User.findOne({
        // email: email
        // email: emailOrPhone
        $or: [ { email: emailOrPhone }, { phoneNumber: emailOrPhone } ] 
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email or phone no is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  }); 

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
},
}