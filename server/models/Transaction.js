const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    destiny: {
      type: mongoose.Schema.Types.ObjectId,
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

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
