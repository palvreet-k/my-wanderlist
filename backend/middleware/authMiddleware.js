import passport from 'passport';

// Verifies the JWT Bearer token and sets req.user. No sessions.
const protect = passport.authenticate('jwt', { session: false });

export default protect;
