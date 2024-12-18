const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    dateStart: { 
      type: Date, 
      required: true, 
      validate: {
        validator: (v) => !isNaN(new Date(v).getTime()),
        message: "Invalid date format"
      }
    },
    dateEnd: { 
      type: Date, 
      required: true, 
      validate: {
        validator: (v) => !isNaN(new Date(v).getTime()),
        message: "Invalid date format"
      }
    },
    contrat: { type: String, required: true },
    salaire: { type: Number, required: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    enterprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });
  
  module.exports = mongoose.model('JobOffer', jobOfferSchema);