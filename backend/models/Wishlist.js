import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  country:  { type: String, required: true },
  flag:     { type: String, default: '' },
  bestTime: { type: String, default: '' },
  budget:   { type: String, default: '' },
  notes:    { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);
