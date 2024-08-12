const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
    ShopKeeperName: { type: String, required: false },
    ShopName: { type: String, required: false },
    ShopNumber: { type: String, required: false },
    PhoneNumber: { type: String, required: false },
    Email: { type: String, required: false },
    ShopImage: { type: Object, required: false },
}, { timestamp: true });

module.exports = mongoose.model("shop", shopSchema);