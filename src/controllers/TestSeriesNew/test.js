const Test = require("../../models/TestModel");
const apiResponse = require("../../helpers/apiResponse");
const { deleteFileFromS3 } = require('../../helpers/fileUploader');
require('dotenv').config();

// Create Test
exports.createTest = async (req, res) => {
  try {
    const { seriesId, title, description, duration, totalMarks, passingMarks, questions } = req.body;
    // const test = new Test(req.body);
    const image = req.files['image'] ? req.files['image'][0].key : null;

    const test = new Test({
      seriesId,
      title,
      description,
      image: image,
      duration,
      totalMarks,
      passingMarks,
      questions: JSON.parse(questions), // because sent as stringified JSON from form-data
    });
    await test.save();
    res.status(201).json({ success: true, message: "Test created", data: test });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate("seriesId");
    res.json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Test by ID
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("seriesId");
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Test
exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    res.json({ success: true, message: "Test updated", data: test });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Test
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    res.json({ success: true, message: "Test deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
