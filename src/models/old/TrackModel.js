var mongoose = require("mongoose");

var TrackSchema = new mongoose.Schema({
	userId: {type: String, required: false},
	fcmToken: {type: String, required: false},
	deviceId: {type: String, required: true},
	type: {type: String, required: false},
	lastLogin: {type: String, required: false},	
}, {timestamps: true});


module.exports = mongoose.model("Track", TrackSchema);