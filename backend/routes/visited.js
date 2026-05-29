
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
   try {
    const newVisited = await Visited.create({
      userId: req.body.userId,
      countryId: req.body.countryId,
      visited: req.body.visited ?? false,
      visitDate: req.body.visitDate,
      rating: req.body.rating,
      notes: req.body.notes
    });

    res.status(201).json({
      message: 'Visited record created successfully',
      data: newVisited
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating visited record' });
  }
});

// PUT /api/visited/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Visited.findByIdAndUpdate(
      req.params.id,
      {  visitDate: req.body.visitDate,
        notes: req.body.notes }
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
    res.status(500).json({ message: 'Error updating notes' });
  }
});

// DELETE /api/visited/:id
router.delete('/:id', protect, async (req, res) => {
  try{
    const deleted = await Visited.findByIdAndDelete(req.params.id);

    if(!deleted){
      return res.status(404).json('Visited country record not found')
    }
    res.json({
      message: 'Visited record deleted successfully',
      data: deleted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting visited record' });
  }
});

export default router;