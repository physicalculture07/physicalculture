var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var courseSchema = new Schema({
	courseName: { type: String, required: true },
	courseFees: { type: String, required: true },
	courseValidity: { type: String, required: true },
	courseImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);