const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  cv: { type: String, required: true },
  picture: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Candidate', candidateSchema);