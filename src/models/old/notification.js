var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    auctionId: { type: String, required: false },
    senderId: { type: String, required: true },
    senderRole: { type: String, required: true },
    receiverId: { type: String, required: true },
    receiverRole: { type: String, required: true },
    title: { type: String, required: true },
    decription: { type: String, required: true },
    type: { type: String, required: true },
    readStatus: { type: String, required: true },
    NotificationFor: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("notification", notificationSchema);