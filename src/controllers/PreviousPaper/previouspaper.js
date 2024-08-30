// controllers/previousPapersController.js

const PreviousPapers = require('../../models/PreviousPaperModel');
const apiResponse = require("../../helpers/apiResponse");



// Upload a new previous paper
const createPreviousPaper = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
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
    if (previousPapers.length > 0) {
			return apiResponse.successResponseWithData(res, "previousPapers List.", previousPapers);
		} else {
			return apiResponse.notFoundResponse(res, "previousPapers not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a specific previous paper by ID
const getPreviousPaperById = async (req, res) => {
  try {
    const previousPaper = await PreviousPapers.findById(req.params.id);
    if (previousPaper) {
			return apiResponse.successResponseWithData(res, "previousPapers List.", previousPaper);
		} else {
			return apiResponse.notFoundResponse(res, "previousPapers not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a specific previous paper by ID
const updatePreviousPaperById = async (req, res) => {
  try {
    const { title } = req.body;

    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const existingPreviousPaper = await PreviousPapers.findById(req.params.id);
	  if (!existingPreviousPaper) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (title) existingPreviousPaper.pdfTitle = pdfTitle;
  
	  // Update classVideo and classNotes based on provided files
	  if (pdfUrl) {
		    existingPreviousPaper.pdfUrl = pdfUrl;
	  }

    const updatedPreviousPaper = await existingPreviousPaper.save();
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
