var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SyllabusSchema = new Schema({
	syllabusTitle: { type: String, required: true },
	pdfUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Syllabus", SyllabusSchema);