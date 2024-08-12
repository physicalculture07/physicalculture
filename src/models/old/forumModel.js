const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    Title: { type: String, required: false },
    Description: { type: String, required: false },
    ShortDescription: { type: String, required: false },
    Category: { type: String, required: false },
    CategoryId: { type: mongoose.Schema.Types.ObjectId, required: false },
    Image: { type: Array, required: false },
    IsAdminAdded: { type: Boolean, required: false },
    IsLiked: { type: Boolean, required: false },
    TotalLike: { type: Number, required: false },
    TotalComment: { type: Number, required: false },
    TotalShared: { type: Number, required: false },
    Status: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("forumData", forumSchema);