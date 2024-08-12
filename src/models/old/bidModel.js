var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var bidSchema = new Schema({
	userId: {type: String, required: false},
	auctionId: {type: String, required: false},
	sellerId: {type: String, required: false},
	amount: {type: Number, required: false},
	sellerName: {type: String, required: false},
	auctionStatus: {type: String, required: false},
	userAddress: {type: String, required: false}

	

	
}, {timestamps: true});

module.exports = mongoose.model("bid", bidSchema);
