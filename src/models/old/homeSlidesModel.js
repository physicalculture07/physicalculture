const mongoose = require("mongoose");

const homeSlideSchema = mongoose.Schema({
    title: { type: String, required: false },
    content: { type: String, required: false },
    price: { type: String, required: false },
    bidPrice: { type: String, required: false },
    Image: { type: Object, required: false },
}, { timestamps: true });

module.exports = mongoose.model("homeSlide", homeSlideSchema);