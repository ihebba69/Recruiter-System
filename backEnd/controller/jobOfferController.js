
const JobOffer = require('../model/jobOfferModel');

// Utility: Validate and format dates
const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error(`Invalid date format: ${dateStr}`);
  return date;
};

// Utility: Validate and parse salaire
const parseSalary = (salaryStr) => {
  const salary = parseFloat(salaryStr);
  if (isNaN(salary)) throw new Error(`Invalid salary format: ${salaryStr}`);
  return salary;
};


exports.createJobOffer = async (req, res) => {
  try {
    const { title, description, dateStart, dateEnd, contrat, salaire, enterprise } = req.body;

    if (!title || !description || !dateStart || !dateEnd || !contrat || !salaire || !enterprise) {
      return res.status(400).json({
        message: "title, description, dateStart, dateEnd, contrat, salaire, and enterprise are required"
      });
    }

    const parsedDateStart = parseDate(dateStart);
    const parsedDateEnd = parseDate(dateEnd);
    const parsedSalary = parseSalary(salaire);

    const jobOffer = new JobOffer({
      title,
      description,
      dateStart: parsedDateStart,
      dateEnd: parsedDateEnd,
      contrat,
      salaire: parsedSalary,
      enterprise,
      status: 'active'
    });

    const savedJobOffer = await jobOffer.save();
    const populatedJobOffer = await JobOffer.findById(savedJobOffer._id)
      .populate('enterprise', 'nomEntreprise')
      .populate('createdBy', 'fullName');

    res.status(201).json(populatedJobOffer);
  } catch (error) {
    res.status(500).json({
      message: "Error creating job offer",
      error: error.message
    });
  }
};


exports.getAllJobOffers = async (req, res) => {
  try {
    const jobOffers = await JobOffer.find()
      .populate('enterprise', 'nomEntreprise')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job offers', error: error.message });
  }
};


exports.getJobOfferById = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.id)
      .populate('enterprise', 'nomEntreprise')
      .populate('createdBy', 'fullName');

    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job offer', error: error.message });
  }
};


exports.updateJobOffer = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.id);
    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    if (req.body.dateStart) req.body.dateStart = parseDate(req.body.dateStart);
    if (req.body.dateEnd) req.body.dateEnd = parseDate(req.body.dateEnd);
    if (req.body.salaire) req.body.salaire = parseSalary(req.body.salaire);

    const updatedJobOffer = await JobOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('enterprise', 'nomEntreprise')
      .populate('createdBy', 'fullName');

    res.status(200).json(updatedJobOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job offer', error: error.message });
  }
};


exports.deleteJobOffer = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.id);
    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    await JobOffer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job offer', error: error.message });
  }
};


