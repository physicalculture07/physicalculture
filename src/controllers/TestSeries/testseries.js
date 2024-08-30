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

const updateTestSeriesById = async (req, res) => {
  try {
    const { testSeriesTitle } = req.body;

    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const existingTestSeries = await TestSeriesModel.findById(req.params.id);
	  if (!existingTestSeries) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (testSeriesTitle) existingTestSeries.testSeriesTitle = testSeriesTitle;
  
	  // Update classVideo and classNotes based on provided files
	  if (pdfUrl) {
		    existingTestSeries.pdfUrl = pdfUrl;
	  }

    const updatedTestSeries = await existingTestSeries.save();
	  res.status(200).json(updatedTestSeries);


  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



module.exports = {createTestSeries, getAllTestSeries, getTestSeriesById, updateTestSeriesById};