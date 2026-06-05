// routes/auth.js
// POST /api/auth/register - hash password, create user, return a JWT
// POST /api/auth/login    - verify password with bcrypt, return a JWT
// GET  /api/auth/logout   - client drops the token (no server session)
// GET  /api/auth/me       - return the authenticated user

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// GET /api/auth/logout - with JWT there is no server session to destroy;
// the client just deletes its stored token. Kept for frontend convenience.
router.get('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me - returns the authenticated user (req.user set by JWT strategy)
router.get('/auth/me', protect, (req, res) => {
  res.json(req.user);
});

export default router;
