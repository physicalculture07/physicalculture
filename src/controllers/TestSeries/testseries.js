const TestSeriesModel = require('../../models/TestSeriesModel');
const apiResponse = require("../../helpers/apiResponse");


// Upload a new previous paper
const createTestSeries = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const newtestseries = new TestSeriesModel({
        testSeriesTitle: req.body.testSeriesTitle,
      pdfUrl: pdfUrl // Save the file path
    });

    const savedtestseries = await newtestseries.save();
    res.status(201).json(savedtestseries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all Syllabus
const getAllTestSeries = async (req, res) => {
  try {
    const testSeries = await TestSeriesModel.find();
    if (testSeries.length > 0) {
			return apiResponse.successResponseWithData(res, "testSeries List.", testSeries);
		} else {
			return apiResponse.notFoundResponse(res, "testSeries not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a specific Syllabus by ID
const getTestSeriesById = async (req, res) => {
  try {
    const testSeries = await TestSeriesModel.findById(req.params.id);
    if (testSeries) {
			return apiResponse.successResponseWithData(res, "testSeriess List.", testSeries);
		} else {
			return apiResponse.notFoundResponse(res, "testSeriess not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};


module.exports = {createTestSeries, getAllTestSeries, getTestSeriesById};