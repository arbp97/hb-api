const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    accountNumber: { type: String, required: true, index: { unique: true } },
    dni: { type: Number, required: true},
    currencyId: { type: Number, required: true},
    cciCode: { type: String, required: true},
    balance: { type: Number, required: true},
    state: { type: String, required: true},
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;   