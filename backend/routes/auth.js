// routes/auth.js
// POST /api/auth/register  - hash password, create user
// POST /api/auth/login     - passport.authenticate('local')
// GET  /api/auth/logout    - req.logout()
// GET  /api/auth/me        - return req.user



import express from 'express';
import passport from 'passport';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

//Auth endpoints


// router.post("/login", passport.authenticate('local', {
//   successRedirect: "/profile", 
//   failureRedirect: "/crash"
// }));

// router.get('/logout', function(req, res, next){ 
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     res.redirect('/login');
//   });
// });

// OAuth Specific Endpoints- For testing only
// Go to /api/auth/myauth
// Login with Google
// You see a message with you name

router.get('/auth/myoauth', async (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

router.get('/auth/google', 
    passport.authenticate("google", {scope: ["profile", "email"]}));

router.get('/auth/google/callback', passport.authenticate("google", {failureRedirect:"/"}), 
    (req, res)=> {res.redirect('/googlewelcome')});

router.get('/googlewelcome', async (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

export default router;