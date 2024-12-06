var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NewsSchema = new Schema({
	Title: { type: String, required: true },
	description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("News", NewsSchema);