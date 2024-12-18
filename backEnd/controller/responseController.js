// controllers/responseController.js
const Response = require('../model/responseModel');

// Create a new response
exports.createResponse = async (req, res) => {
  try {
    const { description, title, question } = req.body;

    if (!description || !title || !question) {
      return res.status(400).json({ message: "description, title, and question are required" });
    }

    const response = new Response({
      description,
      title,
      question
    });

    const savedResponse = await response.save();
    const populatedResponse = await Response.findById(savedResponse._id)
      .populate('question', 'description title');

    res.status(201).json(populatedResponse);
  } catch (error) {
    res.status(500).json({ message: "Error creating response", error: error.message });
  }
};

// Get all responses
exports.getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find()
      .populate('question', 'description title')
      .sort({ createdAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses", error: error.message });
  }
};

// Get a response by ID
exports.getResponseById = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('question', 'description title');

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching response", error: error.message });
  }
};

// Update a response by ID
exports.updateResponse = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    const updatedResponse = await Response.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('question', 'description title');

    res.status(200).json(updatedResponse);
  } catch (error) {
    res.status(500).json({ message: "Error updating response", error: error.message });
  }
};

exports.deleteResponse = async (req, res) => {
    try {
      const response = await Response.findById(req.params.id);
      if (!response) {
        return res.status(404).json({ message: "Response not found" });
      }
  
      await Response.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Response deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting response", error: error.message });
    }
  };