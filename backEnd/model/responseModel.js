const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  title: { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);