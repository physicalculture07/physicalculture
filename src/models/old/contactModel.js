var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var contactSchema = new Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
	phone: {type: String, required: true},
	email: {type: String, required: true},
    company: {type: String, required: false},
    yourQuestion: {type:String, required:true}
}, {timestamps: true});

module.exports = mongoose.model("contact-us", contactSchema);