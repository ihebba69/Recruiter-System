const mongoose = require('mongoose');

const enterpriseSchema = new mongoose.Schema({
  nomEntreprise: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  localite: { type: String, required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Enterprise', enterpriseSchema);