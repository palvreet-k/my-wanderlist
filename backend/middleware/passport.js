require('dotenv').config();
const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt        = require('bcryptjs');
const User          = require('../models/User');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},(accessToken, refreshToken, profile, done)=>{
    return done(null, profile);
}
)
);


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (id, done) => {
  done(null, id)
});

module.exports = passport;