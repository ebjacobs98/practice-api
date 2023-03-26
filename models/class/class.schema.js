const { Schema } = require("mongoose");

const ClassSchema = new Schema(
  {
    name: { type: String, required: [true, "Must have name"] },
    teacher: { type: String, required: [true, "Must have teacher"] },
    students: { type: [String], default: [], required: true },
    pendingStudents: { type: [String], default: [], required: true },
  },
  { timestamps: true }
);

module.exports = ClassSchema;
