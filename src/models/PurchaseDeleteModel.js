var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var purchaseSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // assuming you have a User model
  purchaseDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], required: false, default: "Pending" },
  transactionId: { type: String, required: true },
  amount: { type: String, required: false },
  comment: { type: String, required: false },
  deviceId:{ type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("PurchaseDelete", purchaseSchema);
