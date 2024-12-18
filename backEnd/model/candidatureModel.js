const mongoose = require('mongoose');

const candidatureSchema = new mongoose.Schema({
  dateCandidature: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  offreEmploi: { type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Candidature', candidatureSchema);