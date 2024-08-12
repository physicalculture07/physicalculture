const mongoose = require('mongoose');

const forumLikeAndComment = mongoose.Schema({
    UserName: { type: String, required: false },
    forumId: { type: mongoose.Schema.Types.ObjectId, required: false },
    TotalLike: { type: Number, required: false },
    TotalComment: { type: Array, required: false }
}, { timestamps: true });

module.exports = mongoose.model("forumLike&Comment", forumLikeAndComment);