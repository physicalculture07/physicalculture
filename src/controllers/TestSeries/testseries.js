const TestSeriesModel = require('../../models/TestSeriesModel');


// Upload a new previous paper
const createTestSeries = async (req, res) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].path : null;
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

module.exports = {createTestSeries};