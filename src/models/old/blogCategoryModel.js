var mongoose = require("mongoose");

const blogCategoryModel = mongoose.Schema({
    Name: { type: String, required: false },
    Status: { type: String, reuired: false, bydefault: 0 }
}, { timestamps: true });

module.exports = mongoose.model("blogCategoryData", blogCategoryModel);