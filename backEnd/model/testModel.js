const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  description: { type: String, required: true },
  time: { type: Number, required: true },
  date: { type: Date, required: true },
  score: { type: Number },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);