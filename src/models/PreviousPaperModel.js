var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PreviousPaperSchema = new Schema({
	title: { type: String, required: true },
	pdfUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("PreviousPapers", PreviousPaperSchema);