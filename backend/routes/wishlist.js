
import express from 'express';
import Wishlist from '../models/Wishlist.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/wishlist
router.post('/', protect, async (req, res) => {
  // ...
});

// PUT /api/wishlist/:id
router.put('/:id', protect, async (req, res) => {
  // ...
});

// DELETE /api/wishlist/:id
router.delete('/:id', protect, async (req, res) => {
  // ...
});

export default router;