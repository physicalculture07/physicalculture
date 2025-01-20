var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var chapterSchema = new Schema({
	courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
	chapterName: { type: String, required: true },
	description: { type: String, required: true },
	chapterImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Chapter", chapterSchema);