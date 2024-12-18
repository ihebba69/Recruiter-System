
const Question = require('../model/questionModel');

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { description, title } = req.body;

    if (!description || !title ) {
      return res.status(400).json({ message: "description, title, and test are required" });
    }

    const question = new Question({
      description,
      title,
      
    });

    const savedQuestion = await question.save();
    const populatedQuestion = await Question.findById(savedQuestion._id)
      .populate('test', 'description');

    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error creating question", error: error.message });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('test', 'description')
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

// Get a question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('test', 'description');

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error: error.message });
  }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('test', 'description');

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
};
