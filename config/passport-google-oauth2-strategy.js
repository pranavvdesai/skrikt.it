const passport = require("passport");

const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (err) {
          console.log("err in google strategy", err);
          return;
        }
        console.log(profile);
        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              email: profile.emails[0].value,
              name: profile.displayName,
              password: crypto.randomBytes(20).toString("hex"),
            },
            (err, user) => {
              if (err) {
                console.log("err in google strategy", err);
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
