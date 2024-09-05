var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TestSeriesSchema = new Schema({
	testSeriesTitle: { type: String, required: true },
	description: { type: String, required: true },
	pdfUrl: { type: String, required: true },
	pdfImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("TestSeries", TestSeriesSchema);