var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var addressSchema = new Schema({
	name: {type: String, required: false},
	userId: {type: String, required: false},
    area: {type: String, required: false},
    buildingNo: {type: String, required: false},
    country: {type: String, required: false},
    landmark: {type: String, required: false},
    mobNo: {type: String, required: false},
    state: {type: String, required: false},
    street: {type: String, required: false},
    zipCode: {type: String, required: false},
    
	// isbn: {type: String, required: true},
	// user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("userAddress", addressSchema);