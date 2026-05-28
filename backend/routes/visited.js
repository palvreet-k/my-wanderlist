
import express from 'express';
import Visited from '../models/Visited.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/visited
router.get('/', protect, async (req, res) => {
  try {
    const items = await Visited.find({ userId: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/visited
router.post('/', protect, async (req, res) => {
  // ...
});

// PUT /api/visited/:id
router.put('/:id', protect, async (req, res) => {
  // ...
});

// DELETE /api/visited/:id
router.delete('/:id', protect, async (req, res) => {
  // ...
});

export default router;