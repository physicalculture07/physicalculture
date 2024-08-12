var mongoose = require("mongoose");

var SellerSchema = new mongoose.Schema({
	userName: {type:String, require: false},
	contcatName: {type: String, required: false},
	sellerName: {type: String, required: false},
	email: {type: String, required: false},
	sellerMobNumber: {type: String, required: true},
	gender: {type: String, required: false},
	businessName: {type: String, required: false},
	gstNumber: {type: String, required: false},
	panNumber: {type: String, required: false},
	contactMobNumber: {type: String, required: false},
	// productCategory: {type: String, required: false},
	productCategory: {type: Object, required: false},
	address: {type: String, required: false},
	zipode: {type: String, required: false},
	regions: {type: String, required: false},	
	password: {type: String, required: false},
	otp: {type: String, required:false},
	isSellerMobNumberVerified: {type: Boolean, required: false, default: 0},
	status: {type: Boolean, required: false, default: 1}

}, {timestamps: true});

module.exports = mongoose.model("Seller", SellerSchema);