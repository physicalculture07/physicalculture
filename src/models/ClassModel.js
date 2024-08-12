var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var classSchema = new Schema({
	// courseId: { type: String, required: true },
	courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
	className: { type: String, required: true },
	classVideo:{ type: String, required: true },
	classNotes: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);