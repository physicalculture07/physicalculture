var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PdfNotesSchema = new Schema({
	pdfTitle: { type: String, required: true },
	pdfUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("PdfNotes", PdfNotesSchema);