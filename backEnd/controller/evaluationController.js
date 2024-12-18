
const Evaluation = require('../model/evaluationModel');

// Utility: Validate and format dates
const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error(`Invalid date format: ${dateStr}`);
  return date;
};

// Create a new evaluation
exports.createEvaluation = async (req, res) => {
  try {
    const { avis, description, date, candidate, jobOffer } = req.body;

    if (!avis || !description || !date || !candidate || !jobOffer) {
      return res.status(400).json({ message: "avis, description, date, candidate, and jobOffer are required" });
    }

    const parsedDate = parseDate(date);

    const evaluation = new Evaluation({
      avis,
      description,
      date: parsedDate,
      candidate,
      jobOffer
    });

    const savedEvaluation = await evaluation.save();
    const populatedEvaluation = await Evaluation.findById(savedEvaluation._id)
      .populate('candidate', 'fullName')
      .populate('jobOffer', 'title');

    res.status(201).json(populatedEvaluation);
  } catch (error) {
    res.status(500).json({ message: "Error creating evaluation", error: error.message });
  }
};

// Get all evaluations
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate('candidate', 'fullName')
      .populate('jobOffer', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching evaluations", error: error.message });
  }
};

// Get an evaluation by ID
exports.getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('candidate', 'fullName')
      .populate('jobOffer', 'title');

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching evaluation", error: error.message });
  }
};

// Update an evaluation by ID
exports.updateEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    if (req.body.date) req.body.date = parseDate(req.body.date);

    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('candidate', 'fullName')
      .populate('jobOffer', 'title');

    res.status(200).json(updatedEvaluation);
  } catch (error) {
    res.status(500).json({ message: "Error updating evaluation", error: error.message });
  }
};

// Delete an evaluation by ID
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    await Evaluation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Evaluation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting evaluation", error: error.message });
  }
};
