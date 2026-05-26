// models/WatchlistItem.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  countryId: { type: String, required: true },
  notes: {type: String,  default: ''}
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);