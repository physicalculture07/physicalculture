var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var masterCategorySchema = new Schema({
	name: {type: String, required: true},
	image: {type: Object, required: false},
}, {timestamps: true});

module.exports = mongoose.model("masterCategory", masterCategorySchema);