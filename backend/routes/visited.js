
import express from 'express';
import Visited from '../models/Visited.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/visited - all visited countries for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const items = await Visited.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/visited - add a visited country
router.post('/', protect, async (req, res) => {
  try {
    const newVisited = await Visited.create({
      userId:    req.user._id,
      country:   req.body.country,
      flag:      req.body.flag,
      visitDate: req.body.visitDate || null,
      rating:    req.body.rating || null,
      notes:     req.body.notes
    });

    res.status(201).json({
      message: 'Visited record created successfully',
      data: newVisited
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating visited record', error: err.message });
  }
});

// PUT /api/visited/:id - update one of the user's visited records
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Visited.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        visitDate: req.body.visitDate || null,
        rating:    req.body.rating || null,
        notes:     req.body.notes
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Visited record not found' });
    }

    res.json({
      message: 'Notes updated successfully',
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating notes', error: err.message });
  }
});

// DELETE /api/visited/:id - remove one of the user's visited records
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Visited.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deleted) {
      return res.status(404).json('Visited country record not found');
    }
    res.json({
      message: 'Visited record deleted successfully',
      data: deleted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting visited record', error: err.message });
  }
});

export default router;
