const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currencySchema = new Schema(
  {
    iso: { type: String, required: true, index: { unique: true } },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;
