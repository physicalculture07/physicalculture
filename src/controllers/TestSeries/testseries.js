const TestSeriesModel = require('../../models/TestSeriesModel');
const apiResponse = require("../../helpers/apiResponse");
const { deleteFileFromS3 } = require('../../helpers/fileUploader');


// Upload a new previous paper
const createTestSeries = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
	const pdfImage = req.files['pdfImage'] ? req.files['pdfImage'][0].key : null;
    const newtestseries = new TestSeriesModel({
        testSeriesTitle: req.body.testSeriesTitle,
		description: req.body.description,
      pdfUrl: pdfUrl,
	  pdfImage:pdfImage
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
    const { testSeriesTitle, description } = req.body;

    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
	const pdfImage = req.files['pdfImage'] ? req.files['pdfImage'][0].key : null;
    const existingTestSeries = await TestSeriesModel.findById(req.params.id);
	  if (!existingTestSeries) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (testSeriesTitle) existingTestSeries.testSeriesTitle = testSeriesTitle;
	if (description) existingTestSeries.description = description;
  
	  // Update classVideo and classNotes based on provided files
	  if (pdfUrl) {
		    existingTestSeries.pdfUrl = pdfUrl;
	  }
	  if (pdfImage) {
		existingTestSeries.pdfImage = pdfImage;
  }

    const updatedTestSeries = await existingTestSeries.save();
	  res.status(200).json(updatedTestSeries);


  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTestSeriesById = async (req, res, next) => {
	try {
	  
	  const existingTestSeries = await TestSeriesModel.findById(req.params.id);
	  
	  if (!existingTestSeries) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Delete associated files from S3

	  if (existingTestSeries.pdfUrl) {
		  await deleteFileFromS3(existingTestSeries.pdfUrl);
	  }

	  if (existingTestSeries.pdfImage) {
		await deleteFileFromS3(existingTestSeries.pdfImage);
	}
  
	  // Delete the class from the database
	  await TestSeriesModel.findByIdAndDelete(req.params.id);
  
	  res.status(200).json({ message: 'Class and associated files deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};



module.exports = {createTestSeries, getAllTestSeries, getTestSeriesById, updateTestSeriesById, deleteTestSeriesById};