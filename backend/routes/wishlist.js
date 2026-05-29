
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
   try {
    const item = await Wishlist.create({
      userId: req.body.userId,
      countryId: req.body.countryId,
      notes: req.body.notes
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Create failed' });
  }
});

// PUT /api/wishlist/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Wishlist.findByIdAndUpdate(
      req.params.id,
      {
        notes: req.body.notes
      },
      {new: true}
    );

    if (!updated) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// DELETE /api/wishlist/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Wishlist.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'Deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;