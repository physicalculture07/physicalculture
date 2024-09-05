var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BannerSchema = new Schema({
	bannerTitle: { type: String, required: true },
	bannerUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Banner", BannerSchema);