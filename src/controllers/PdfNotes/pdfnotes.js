const PdfNotes = require('../../models/PdfNotesModel');
const apiResponse = require("../../helpers/apiResponse");

// Upload a new PDF note
const createPdfNote = async (req, res, next) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    
    const newPdfNote = new PdfNotes({
      pdfTitle: req.body.pdfTitle,
      pdfUrl: pdfUrl // Save the file path
    });

    const savedPdfNote = await newPdfNote.save();
    res.status(201).json(savedPdfNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all PDF notes
const getAllPdfNotes = async (req, res) => {
  try {
    const pdfNotes = await PdfNotes.find();
    if (pdfNotes.length > 0) {
			return apiResponse.successResponseWithData(res, "pdfNotes List.", pdfNotes);
		} else {
			return apiResponse.notFoundResponse(res, "pdfNotes not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a specific PDF note by ID
const getPdfNoteById = async (req, res) => {
  try {
    const pdfNote = await PdfNotes.findById(req.params.id);
    if (pdfNote) {
			return apiResponse.successResponseWithData(res, "pdfNotes List.", pdfNote);
		} else {
			return apiResponse.notFoundResponse(res, "pdfNotes not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a specific PDF note by ID
const updatePdfNoteById = async (req, res) => {
  try {
    const { pdfTitle } = req.body;
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].key : null;
    const existingPdfNote = await PdfNotes.findById(req.params.id);
	  if (!existingPdfNote) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (pdfTitle) existingPdfNote.pdfTitle = pdfTitle;
  
	  // Update classVideo and classNotes based on provided files
	  if (pdfUrl) {
		    existingPdfNote.pdfUrl = pdfUrl;
	  }

    const updatedPdfNotes = await existingPdfNote.save();
	  res.status(200).json(updatedPdfNotes);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};

// Delete a specific PDF note by ID
const deletePdfNoteById1 = async (req, res) => {
  try {
    const deletedPdfNote = await PdfNotes.findByIdAndDelete(req.params.id);
    if (!deletedPdfNote) return res.status(404).json({ error: 'PDF note not found' });

    // Delete the file from the server
    fs.unlink(path.join(__dirname, '../', deletedPdfNote.pdfUrl), (err) => {
      if (err) console.error(err);
    });

    res.status(200).json({ message: 'PDF note deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePdfNoteById = async (req, res, next) => {
	try {
	  
	  const existingPdfNote = await PdfNotes.findById(req.params.id);
	  
	  if (!existingPdfNote) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Delete associated files from S3

	  if (existingPdfNote.pdfUrl) {
		  await deleteFileFromS3(existingPdfNote.pdfUrl);
	  }
  
	  // Delete the class from the database
	  await PdfNotes.findByIdAndDelete(req.params.id);
  
	  res.status(200).json({ message: 'Class and associated files deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};

module.exports = {
  createPdfNote,
  getAllPdfNotes,
  getPdfNoteById,
  updatePdfNoteById,
  deletePdfNoteById
};
