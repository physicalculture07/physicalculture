const SyllabusModel = require('../../models/SyllabusModel');


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

module.exports = {createSyllabus};