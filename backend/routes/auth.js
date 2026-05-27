// routes/auth.js
// POST /api/auth/register  - hash password, create user
// POST /api/auth/login     - passport.authenticate('local')
// GET  /api/auth/logout    - req.logout()
// GET  /api/auth/me        - return req.user



const express = require('express');
const passport = require('passport');
const router  = express.Router();
const protect = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

router.get('/auth/google', 
    passport.authenticate("google", {scope: ["profile", "email"]}));

router.get('/auth/google/callback', passport.authenticate("google", {failureRedirect:"/"}), 
    (req, res)=> {res.redirect('/profile')});

router.get('/profile', async (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

router.get('/logout', async (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;