// controllers/previousPapersController.js

const PreviousPapers = require('../../models/PreviousPaperModel');


// Upload a new previous paper
const createPreviousPaper = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].path : null;
    const newPreviousPaper = new PreviousPapers({
      title: req.body.title,
      pdfUrl: pdfUrl // Save the file path
    });

    const savedPreviousPaper = await newPreviousPaper.save();
    res.status(201).json(savedPreviousPaper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all previous papers
const getAllPreviousPapers = async (req, res) => {
  try {
    const previousPapers = await PreviousPapers.find();
    res.status(200).json(previousPapers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a specific previous paper by ID
const getPreviousPaperById = async (req, res) => {
  try {
    const previousPaper = await PreviousPapers.findById(req.params.id);
    if (!previousPaper) return res.status(404).json({ error: 'Previous paper not found' });
    res.status(200).json(previousPaper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a specific previous paper by ID
const updatePreviousPaperById = async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
    };

    if (req.file) {
      updatedData.pdfUrl = req.file.path;
    }

    const updatedPreviousPaper = await PreviousPapers.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedPreviousPaper) return res.status(404).json({ error: 'Previous paper not found' });
    res.status(200).json(updatedPreviousPaper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a specific previous paper by ID
const deletePreviousPaperById = async (req, res) => {
  try {
    const deletedPreviousPaper = await PreviousPapers.findByIdAndDelete(req.params.id);
    if (!deletedPreviousPaper) return res.status(404).json({ error: 'Previous paper not found' });

    // Delete the file from the server
    fs.unlink(path.join(__dirname, '../', deletedPreviousPaper.pdfUrl), (err) => {
      if (err) console.error(err);
    });

    res.status(200).json({ message: 'Previous paper deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createPreviousPaper,
  getAllPreviousPapers,
  getPreviousPaperById,
  updatePreviousPaperById,
  deletePreviousPaperById
};
