
const Test = require('../model/testModel');


const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error(`Invalid date format: ${dateStr}`);
  return date;
};

exports.createTest = async (req, res) => {
  try {
    const { description, time, date, score, questions } = req.body;

    if (!description || !time || !date || score === undefined || !questions) {
      return res.status(400).json({ message: "description, time, date, score, and questions are required" });
    }

    const parsedDate = parseDate(date);

    const test = new Test({
      description,
      time,
      date: parsedDate,
      score,
      questions
    });

    const savedTest = await test.save();
    const populatedTest = await Test.findById(savedTest._id)
      .populate('questions', 'questionText');

    res.status(201).json(populatedTest);
  } catch (error) {
    res.status(500).json({ message: "Error creating test", error: error.message });
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate('questions', 'questionText')
      .sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests", error: error.message });
  }
};


exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('questions', 'questionText');

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "Error fetching test", error: error.message });
  }
};


exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (req.body.date) req.body.date = parseDate(req.body.date);

    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('questions', 'questionText');

    res.status(200).json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: "Error updating test", error: error.message });
  }
};


exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    await Test.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting test", error: error.message });
  }
};
