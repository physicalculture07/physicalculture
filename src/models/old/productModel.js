var mongoose = require("mongoose");
var ObjectId = mongoose.ObjectId;

var Schema = mongoose.Schema;

var productSchema = new Schema({
	masterCategoryId: {type: String, required: false},
	masterCategoryName: {type: String, required: false},
	productCategory_id: {type: String, required: false},
	brand_id: {type: String, required: false},
	originalPrice: {type: Number, required: false},
	bidPrice: {type: Number, required: false},
	sellerId: {type: String, required: false},
	prodouctDetails: {type: String, required: false},
	productCategory: {type: String, required: false},
	productName: {type: String, required: false},
	brand: {type: String, required: false},
	prdouctInfo: {type: Object, required: false},
	file: {type: Object, required: false},
	meta_title: {type: String, required: false},
	meta_keywords: {type: String, required: false},
	meta_description: {type: String, required: false}

	
}, {timestamps: true});

module.exports = mongoose.model("product", productSchema);
