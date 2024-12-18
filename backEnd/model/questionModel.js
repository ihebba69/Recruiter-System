const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  title: { type: String, required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);