import mongoose from 'mongoose';

const visitedSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  country:   { type: String, required: true },
  visitDate: { type: Date },
  rating:    { type: Number, min: 1, max: 5, default: null },
  notes:     { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Visited', visitedSchema);
