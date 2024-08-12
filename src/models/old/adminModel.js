var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true }
},{timestamps:true});

module.exports = mongoose.model("admin", adminSchema);
