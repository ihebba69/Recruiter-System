// controllers/candidatureController.js
const Candidature = require('../model/candidatureModel');

// Create a new candidature
exports.createCandidature = async (req, res) => {
  try {
    const { dateCandidature, offreEmploi, candidate } = req.body;

    if (!dateCandidature || !offreEmploi || !candidate) {
      return res.status(400).json({ message: "dateCandidature, offreEmploi, and candidate are required" });
    }

    const newCandidature = new Candidature({
      dateCandidature,
      offreEmploi,
      candidate
    });

    const savedCandidature = await newCandidature.save();
    res.status(201).json(savedCandidature);
  } catch (error) {
    res.status(500).json({ message: "Error creating candidature", error: error.message });
  }
};

// Get all candidatures
exports.getAllCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find()
      .populate('offreEmploi', 'title')
      .populate('candidate', 'fullName');
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidatures", error: error.message });
  }
};

// Get a candidature by ID
exports.getCandidatureById = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id)
      .populate('offreEmploi', 'title')
      .populate('candidate', 'fullName');

    if (!candidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }

    res.status(200).json(candidature);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidature", error: error.message });
  }
};

// Update a candidature by ID
exports.updateCandidature = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }

    const updatedCandidature = await Candidature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('offreEmploi', 'title')
      .populate('candidate', 'fullName');

    res.status(200).json(updatedCandidature);
  } catch (error) {
    res.status(500).json({ message: "Error updating candidature", error: error.message });
  }
};

// Delete a candidature by ID
exports.deleteCandidature = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }

    await Candidature.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Candidature deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidature", error: error.message });
  }
};
