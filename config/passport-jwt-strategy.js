const env = require('./environment')
const passport = require('passport');
const passportJwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
}

passport.use(new passportJwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({
        _id: jwt_payload._id 
    }, (err, user) => {
        if (err) {
            console.log("err in finding user from jwt");
            return 
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
}
));

module.exports = passport;