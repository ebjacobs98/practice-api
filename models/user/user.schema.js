const { Schema } = require("mongoose");
const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Must have name"] },
    email: { type: String, required: [true, "Must have email"], unique: true },
    password: { type: String, required: [true, "Must have password"] },
  },
  { timestamps: true }
);

module.exports = UserSchema;
