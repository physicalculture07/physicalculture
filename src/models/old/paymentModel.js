var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var paymentSchema = new Schema({
	userId: {type: String, required: false},
	auctionId: {type: String, required: false},
	rozarOrderId: {type: String, required: false},
	paymentStatus: {type: String, required: false},
	entity: {type: String, required: false},
	amount: {type: Number, required: false},
	amount_paid: {type: Number, required: false},
	amount_due: {type: Number, required: false},
	currency: {type: String, required: false},
	receipt: {type: String, required: false},
	offer_id: {type: String, required: false},
	status: {type: String, required: false},
	attempts: {type: String, required: false}
	
	
}, {timestamps: true});

module.exports = mongoose.model("payment", paymentSchema);
