var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var brandSchema = new Schema({
	brandName: { type: String, required: true },
	brandImage: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model("brandCategory", brandSchema);