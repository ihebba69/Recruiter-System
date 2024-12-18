
const Enterprise = require('../model/entrepriseModel');

// Create a new enterprise
exports.createEnterprise = async (req, res) => {
  try {
    const { nomEntreprise, email, localite, recruiter } = req.body;

    if (!nomEntreprise || !email || !localite || !recruiter) {
      return res.status(400).json({ message: "nomEntreprise, email, localite, and recruiter are required" });
    }

    const newEnterprise = new Enterprise({
      nomEntreprise,
      email,
      localite,
      recruiter
    });

    const savedEnterprise = await newEnterprise.save();
    res.status(201).json(savedEnterprise);
  } catch (error) {
    res.status(500).json({ message: "Error creating enterprise", error: error.message });
  }
};

// Get all enterprises
exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.find().populate('recruiter', 'fullName email');
    res.status(200).json(enterprises);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enterprises", error: error.message });
  }
};

// Get an enterprise by ID
exports.getEnterpriseById = async (req, res) => {
  try {
    const enterprise = await Enterprise.findById(req.params.id).populate('recruiter', 'fullName email');

    if (!enterprise) {
      return res.status(404).json({ message: "Enterprise not found" });
    }

    res.status(200).json(enterprise);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enterprise", error: error.message });
  }
};

// Update an enterprise by ID
exports.updateEnterprise = async (req, res) => {
  try {
    const enterprise = await Enterprise.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ message: "Enterprise not found" });
    }

    const updatedEnterprise = await Enterprise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('recruiter', 'fullName email');

    res.status(200).json(updatedEnterprise);
  } catch (error) {
    res.status(500).json({ message: "Error updating enterprise", error: error.message });
  }
};

// Delete an enterprise by ID
exports.deleteEnterprise = async (req, res) => {
  try {
    const enterprise = await Enterprise.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ message: "Enterprise not found" });
    }

    await Enterprise.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Enterprise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting enterprise", error: error.message });
  }
};
