const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    BlogImage: { type: String, required: false },
    Status: { type: String, required: false },
    IsFeatured: { type: Boolean, bydefault: 0 },
    Category: { type: String, required: false },
    CategoryId: { type: mongoose.Schema.Types.ObjectId, required: false },
    Title: { type: String, required: false },
    ShortDescription: { type: String, required: false },
    Description: { type: Object, required: false }
}, { timestamps: true });
module.exports = mongoose.model("blogData", blogSchema);