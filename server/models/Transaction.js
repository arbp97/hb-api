const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    origin: {
      type: String, //cciCode
      ref: "Account",
      required: true,
    },
    destiny: {
      type: String, //cciCode
      ref: "Account",
      required: true,
    },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: {
      type: String, // iso
      ref: "Currency",
      required: true,
    },
    motive: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const Model = mongoose.model("Transaction", transactionSchema);

module.exports = { Model };
