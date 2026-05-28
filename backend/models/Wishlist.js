// models/WatchlistItem.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  countryId: { type: String, required: true },
  notes: {type: String,  default: ''}
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);