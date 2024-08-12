var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var auctionsSchema = new Schema({
	auctionStatus: {type: String, required: false},
    bidPrice: {type: Number, required: false},
    category: {type: String, required: false},
    description: {type: String, required: false},
    originalPrice: {type: Number, required: false},
    productId: {type: String, required: false},
    productImage: {type: String, required: false},
    productName: {type: String, required: false},
    sellerId: {type: String, required: false},
    sendMobileNo: {type: String, required: false},
    sendUserName: {type: String, required: false},
	userAddress: {type: String, required: false},
	userId: {type: String, required: false},
	// user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("auctions", auctionsSchema);