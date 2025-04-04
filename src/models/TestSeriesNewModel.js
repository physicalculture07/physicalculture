var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TestSeriesNewSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 }, // 0 means free
    isFree: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("TestSeriesNew", TestSeriesNewSchema);
