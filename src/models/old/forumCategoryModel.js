const mongoose = require('mongoose');

const forumCategorySchema = new mongoose.Schema({
    Name: { type: String, required: false },
    Status: { type: String, required: false },
    // IsAdmin: { type: Boolean, required: false, bydefault: 0 }
}, { timestamps: true });

module.exports = mongoose.model("forumCategoryData", forumCategorySchema);