
import express from 'express';
import Wishlist from '../models/Wishlist.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wishlist - all items for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/wishlist - add a country to the user's wishlist
router.post('/', protect, async (req, res) => {
  try {
    const item = await Wishlist.create({
      userId:   req.user._id,
      country:  req.body.country,
      flag:     req.body.flag,
      bestTime: req.body.bestTime,
      budget:   req.body.budget,
      notes:    req.body.notes
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// PUT /api/wishlist/:id - update one of the user's wishlist items
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Wishlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        bestTime: req.body.bestTime,
        budget:   req.body.budget,
        notes:    req.body.notes
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// DELETE /api/wishlist/:id - remove one of the user's wishlist items
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'Deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

export default router;
