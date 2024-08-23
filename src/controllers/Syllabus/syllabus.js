const SyllabusModel = require('../../models/SyllabusModel');
const apiResponse = require("../../helpers/apiResponse");


// Upload a new previous paper
const createSyllabus = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const newsyllabusModel = new SyllabusModel({
        syllabusTitle: req.body.syllabusTitle,
      pdfUrl: pdfUrl // Save the file path
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


module.exports = {createSyllabus, getAllSyllabus, getSyllabusById};