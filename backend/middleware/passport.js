import 'dotenv/config';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';

// Passport JWT Strategy - verifies the Bearer token on protected routes
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:    process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select('-password');
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
));

export default passport;
