const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);