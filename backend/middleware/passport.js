import 'dotenv/config';
import passport      from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt        from 'bcryptjs';
import User          from '../models/User.js';

// Passport Local Strategy

passport.use(new LocalStrategy({ usernameField: 'username' },
  async (username, password, done) => {
    try {

      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'User not found' });

      const match = await bcrypt.compare(password, user.password);

      if (!match) return done(null, false, { message: 'Wrong password' });
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
));

// Passport Local- Serailze and Deserailze User
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
   const user = await User.findOne({ _id: id });
  done(null, user); 
});


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

// OAuth Stategy specific to store user info from session
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser(async (id, done) => {
//   done(null, id)
// });

export default passport;