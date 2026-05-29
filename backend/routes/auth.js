// routes/auth.js
// POST /api/auth/register  - hash password, create user
// POST /api/auth/login     - passport.authenticate('local')
// GET  /api/auth/logout    - req.logout()
// GET  /api/auth/me        - return req.user



import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

//Auth endpoints

router.post('/auth/register', async(req, res) =>{ 
  try{

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    res.send('User Registeration success')
    // res.render('/auth/login');
  }
  catch(err){
    console.error(err)
    res.status(500).send('User Registeration error')
  }
});

router.post("/auth/login", passport.authenticate('local', {
  successRedirect: "/api/auth/profile", 
  failureRedirect: "/api/auth/crash"
}));

router.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
});

router.get('/auth/me', protect, async(req, res)=>{
  if(!req.user){
    return res.status(401).json({message: 'Not authenticated'});
  }
  res.json(req.user);
});

//Temp Test routes for login
router.get('/auth/profile', async (req, res) => {
  res.send('Welcome to your profile page');
});

router.get('/auth/crash', async (req, res) => {
  res.send('OOps crash');
});

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