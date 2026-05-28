// models/WatchlistItem.js
import mongoose from 'mongoose';

const visitedSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  countryId: { type: String, required: true },
  visited: { type: Boolean, default: false },
  visitDate: {type: Date, required: true},
  rating:  { type: Number, min: 1, max: 5, default: null },
  notes: {type: String,  default: ''}
}, { timestamps: true });

export default mongoose.model('Visited', visitedSchema);