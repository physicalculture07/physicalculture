var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserPurchaseTestSchema  = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "TestSeriesNew", required: true }
}, { timestamps: true });

module.exports = mongoose.model("UserPurchaseTest", UserPurchaseTestSchema);
