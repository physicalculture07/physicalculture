// controllers/previousPapersController.js

const PreviousPapers = require('../../models/PreviousPaperModel');
const apiResponse = require("../../helpers/apiResponse");
const { deleteFileFromS3 } = require('../../helpers/fileUploader');



// Upload a new previous paper
const createPreviousPaper = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const pdfImage = req.files['pdfImage'] ? req.files['pdfImage'][0].key : null;
    const newPreviousPaper = new PreviousPapers({
      title: req.body.title,
      description: req.body.description,
      pdfUrl: pdfUrl,
      pdfImage:pdfImage
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
    const { title, description } = req.body;

    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const pdfImage = req.files['pdfImage'] ? req.files['pdfImage'][0].key : null;
    const existingPreviousPaper = await PreviousPapers.findById(req.params.id);
	  if (!existingPreviousPaper) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (title) existingPreviousPaper.title = title;
    if (description) existingPreviousPaper.description = description;
  
	  // Update classVideo and classNotes based on provided files
	  if (pdfUrl) {
		    existingPreviousPaper.pdfUrl = pdfUrl;
	  }
    if (pdfImage) {
      existingPreviousPaper.pdfImage = pdfImage;
  }

    const updatedPreviousPaper = await existingPreviousPaper.save();
	  res.status(200).json(updatedPreviousPaper);


  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a specific previous paper by ID
const deletePreviousPaperById1 = async (req, res) => {
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

const deletePreviousPaperById = async (req, res, next) => {
	try {
	  
	  const existingPreviousPaper = await PreviousPapers.findById(req.params.id);
	  
	  if (!existingPreviousPaper) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Delete associated files from S3

	  if (existingPreviousPaper.pdfUrl) {
		  await deleteFileFromS3(existingPreviousPaper.pdfUrl);
	  }
    if (existingPreviousPaper.pdfImage) {
		  await deleteFileFromS3(existingPreviousPaper.pdfImage);
	  }
  
	  // Delete the class from the database
	  await PreviousPapers.findByIdAndDelete(req.params.id);
  
	  res.status(200).json({ message: 'Class and associated files deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};

module.exports = {
  createPreviousPaper,
  getAllPreviousPapers,
  getPreviousPaperById,
  updatePreviousPaperById,
  deletePreviousPaperById
};
