const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    BannerName: { type: String, required: false },
    BannerImage: { type: Object, required: false },
    title: { type: String, required: false },
    content: { type: String, required: false },
    price: { type: String, required: false },
    bidPrice: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("banner", bannerSchema);