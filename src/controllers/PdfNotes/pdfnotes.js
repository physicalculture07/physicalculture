const PdfNotes = require('../../models/PdfNotesModel');


// Upload a new PDF note
const createPdfNote = async (req, res, next) => {
  try {
    const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].path : null;
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
    res.status(200).json(pdfNotes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a specific PDF note by ID
const getPdfNoteById = async (req, res) => {
  try {
    const pdfNote = await PdfNotes.findById(req.params.id);
    if (!pdfNote) return res.status(404).json({ error: 'PDF note not found' });
    res.status(200).json(pdfNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a specific PDF note by ID
const updatePdfNoteById = async (req, res) => {
  try {
    const updatedData = {
      pdfTitle: req.body.pdfTitle,
    };

    if (req.file) {
      updatedData.pdfUrl = req.file.path;
    }

    const updatedPdfNote = await PdfNotes.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedPdfNote) return res.status(404).json({ error: 'PDF note not found' });
    res.status(200).json(updatedPdfNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a specific PDF note by ID
const deletePdfNoteById = async (req, res) => {
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

module.exports = {
  createPdfNote,
  getAllPdfNotes,
  getPdfNoteById,
  updatePdfNoteById,
  deletePdfNoteById
};
