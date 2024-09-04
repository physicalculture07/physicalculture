var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var purchaseSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // assuming you have a User model
  purchaseDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], required: true },
  transactionId: { type: String, required: true },
  deviceId:{ type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);
