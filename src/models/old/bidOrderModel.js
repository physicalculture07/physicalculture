var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var bidOrderSchema = new Schema({
    userId: {type: String, required: false},
	paymentId: {type: String, required: false},
    bidId: {type: String, required: false},
	auctionId: {type: String, required: false},
	bidPrice: {type: Number, required: false},
	category: {type: String, required: false},
	createdBy: {type: String, required: false},
	description: {type: String, required: false},
	originalPrice: {type: Number, required: false},
	productId: {type: String, required: false},
	productImage: {type: String, required: false},
	productName: {type: String, required: false},
	sellerId: {type: String, required: false},
	sendMobileNo: {type: String, required: false},
	sendUserName: {type: String, required: false},
    userAddress: {type: String, required: false},
    status: {type: String, required: false},
    // sellerName: {type: String, required: false}

    	
}, {timestamps: true});

module.exports = mongoose.model("bidsOrder", bidOrderSchema);
