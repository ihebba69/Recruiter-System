
const Recommendation = require('../model/recommendationModel');


const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error(`Invalid date format: ${dateStr}`);
  return date;
};

// Create a new recommendation
exports.createRecommendation = async (req, res) => {
  try {
    const { description, date, user } = req.body;

    if (!description || !date || !user) {
      return res.status(400).json({ message: "description, date, and user are required" });
    }

    const parsedDate = parseDate(date);

    const recommendation = new Recommendation({
      description,
      date: parsedDate,
      user
    });

    const savedRecommendation = await recommendation.save();
    const populatedRecommendation = await Recommendation.findById(savedRecommendation._id)
      .populate('user', 'fullName');

    res.status(201).json(populatedRecommendation);
  } catch (error) {
    res.status(500).json({ message: "Error creating recommendation", error: error.message });
  }
};

// Get all recommendations
exports.getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .populate('user', 'fullName')
      .sort({ createdAt: -1 });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error: error.message });
  }
};

// Get a recommendation by ID
exports.getRecommendationById = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
      .populate('user', 'fullName');

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendation", error: error.message });
  }
};

// Update a recommendation by ID
exports.updateRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    if (req.body.date) req.body.date = parseDate(req.body.date);

    const updatedRecommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('user', 'fullName');

    res.status(200).json(updatedRecommendation);
  } catch (error) {
    res.status(500).json({ message: "Error updating recommendation", error: error.message });
  }
};

// Delete a recommendation by ID
exports.deleteRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    await Recommendation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recommendation", error: error.message });
  }
};
