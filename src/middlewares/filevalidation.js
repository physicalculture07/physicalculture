function validateClassUpload(req, res, next) {
    const errors = [];
  
    // Check if classVideo is present and validate its MIME type
    if (req.files['classVideo']) {
      const classVideoFile = req.files['classVideo'][0];
      if (classVideoFile.mimetype !== 'video/mp4') {
        errors.push('Only MP4 files are allowed for classVideo.');
      }
    }
  
    // Check if classNotes is present and validate its MIME type
    if (req.files['classNotes']) {
      const classNotesFile = req.files['classNotes'][0];
      if (classNotesFile.mimetype !== 'application/pdf') {
        errors.push('Only PDF files are allowed for classNotes.');
      }
    }
  
    // If there are validation errors, send a 400 response with the errors
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    // If no errors, proceed to the next middleware
    next();
  }
  
  module.exports = {validateClassUpload}