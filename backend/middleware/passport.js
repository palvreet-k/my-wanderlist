import 'dotenv/config';
import passport      from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt        from 'bcryptjs';
import User          from '../models/User.js';


//Oauth Stategy with separate endpoints
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

export default passport;