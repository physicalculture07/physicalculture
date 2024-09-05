const SyllabusModel = require('../../models/SyllabusModel');
const apiResponse = require("../../helpers/apiResponse");


// Upload a new previous paper
const createSyllabus = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
	const pdfImage = req.files['pdfImage'] ? req.files['pdfImage'][0].key : null;
    const newsyllabusModel = new SyllabusModel({
        syllabusTitle: req.body.syllabusTitle,
		description: req.body.description,
      pdfUrl: pdfUrl,
	  pdfImage:pdfImage
    });

    const savedsyllabusModel = await newsyllabusModel.save();
    res.status(201).json(savedsyllabusModel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all Syllabus
const getAllSyllabus = async (req, res) => {
  try {
    const syllabusData = await SyllabusModel.find();
    if (syllabusData.length > 0) {
			return apiResponse.successResponseWithData(res, "syllabusData List.", syllabusData);
		} else {
			return apiResponse.notFoundResponse(res, "syllabusData not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a specific Syllabus by ID
const getSyllabusById = async (req, res) => {
  try {
    const syllabusData = await SyllabusModel.findById(req.params.id);
    if (syllabusData) {
			return apiResponse.successResponseWithData(res, "syllabusDatas List.", syllabusData);
		} else {
			return apiResponse.notFoundResponse(res, "syllabusDatas not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

const updateSyllabusById = async (req, res) => {
  try {
    const { syllabusTitle , description} = req.body;

    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
	const pdfImage = req.files['pdfImage'] ? req.files['pdfImage'][0].key : null;
    const existingSyllabus = await SyllabusModel.findById(req.params.id);
	  if (!existingSyllabus) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (syllabusTitle) existingSyllabus.syllabusTitle = syllabusTitle;
	if (description) existingSyllabus.description = description;
  
	  // Update classVideo and classNotes based on provided files
	  if (pdfUrl) {
		    existingSyllabus.pdfUrl = pdfUrl;
	  }
	  if (pdfImage) {
		existingSyllabus.pdfImage = pdfImage;
  }

    const updatedSyllabus = await existingSyllabus.save();
	  res.status(200).json(updatedSyllabus);


  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSyllabusById = async (req, res, next) => {
	try {
	  
	  const existingSyllabus = await SyllabusModel.findById(req.params.id);
	  
	  if (!existingSyllabus) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Delete associated files from S3

	  if (existingSyllabus.pdfUrl) {
		  await deleteFileFromS3(existingSyllabus.pdfUrl);
	  }
	  if (existingSyllabus.pdfImage) {
		await deleteFileFromS3(existingSyllabus.pdfImage);
	}
  
	  // Delete the class from the database
	  await SyllabusModel.findByIdAndDelete(req.params.id);
  
	  res.status(200).json({ message: 'Class and associated files deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};


module.exports = {createSyllabus, getAllSyllabus, getSyllabusById,updateSyllabusById, deleteSyllabusById};