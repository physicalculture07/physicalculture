var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var categorySchema = new Schema({
	masterCategoryId: {type: String, required: true},
	categoryType: {type: String, required: true},
	categoryImage: {type: Object, required: true},
	// isbn: {type: String, required: true},
	// user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("productCategory", categorySchema);