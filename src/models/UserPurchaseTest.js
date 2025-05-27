var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserPurchaseTestSchema  = new Schema({
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "TestSeriesNew", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId,ref: "User", required: true },
    purchaseDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], required: false, default: "Pending" },
    transactionId: { type: String, required: true },
    amount: { type: String, required: false },
    comment: { type: String, required: false },
    deviceId:{ type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("UserPurchaseTest", UserPurchaseTestSchema);
