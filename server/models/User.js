const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    dni: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const Model = mongoose.model("User", userSchema);

module.exports = { Model };
