const mongoose = require("mongoose");
const ClassSchema = require("./class.schema");

module.exports = mongoose.model("Classes", ClassSchema, "Classes");
