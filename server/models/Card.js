const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    cardNumber: { type: String, required: true, index: { unique: true } },
    assocAccountNumber: { type: String, required: true },
    expireDate: { type: Date, required: true },
    state: { type: String, required: true },
    cardType: { type: String, required: true },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
