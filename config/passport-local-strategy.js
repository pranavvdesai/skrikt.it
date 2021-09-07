const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    function (req,email, password, done) {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          req.flash('error', err);
          return done(err);
        }

        if (!user || user.password != password) {
          req.flash('error', 'Invalid email or password');
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, (err, user) => {
    if (err) {
      console.log('error in finding user --> passport');
      return done(err);
    }

    return done(null, user);
  });
});

passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/register');
};

passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
