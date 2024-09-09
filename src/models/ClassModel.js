var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var classSchema = new Schema({
	// courseId: { type: String, required: true },
	courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
	className: { type: String, required: true },
	classDescription: { type: String, required: true },
	classType: { type: String, required: true, default:"Paid" },
	classImage:{ type: String, required: false },
	classVideo:{ type: String, required: false },
	classNotes: { type: String, required: false },
	isClassVideoDownloaded: { type: Boolean, required: false, default:false },
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);