const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  avis: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);