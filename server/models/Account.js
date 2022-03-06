const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    accountNumber: { type: String, required: true, index: { unique: true } },
    owner: {
      type: Number, //dni
      ref: "User",
      required: true,
    },
    currency: {
      type: String, // iso
      ref: "Currency",
      required: true,
    },
    cciCode: { type: String, required: true },
    balance: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // temp FIXME
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const Model = mongoose.model("Account", accountSchema);

saveOrUpdate = async (account) => {
  let query = { accountNumber: account.accountNumber },
    update = {
      owner: account.owner,
      currency: account.currency,
      cciCode: account.cciCode,
      balance: account.balance,
      email: account.email,
      password: account.password,
      state: account.state,
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  let result;
  try {
    await Model.updateOne(query, update, options, function (err, docs) {
      if (err) {
        console.log(err);
        result = err;
      } else result = docs;
    });
  } catch (err) {
    console.log(err);
  }

  return result;
};

findByCci = async (cci) => {
  let account;

  try {
    await Model.findOne({ cciCode: cci }, function (err, docs) {
      if (err) {
        console.log(err);
        account = err;
      } else account = docs;
    });
  } catch (err) {
    console.log(err);
  }
  return account;
};

removeOne = async (account) => {
  let result;
  try {
    await Model.deleteOne({ cciCode: account.cciCode }, function (err, docs) {
      if (err) {
        console.log(err);
        result = err;
      } else result = docs;
    });
  } catch (err) {
    console.log(err);
  }

  return result;
};

module.exports = { Model, findByCci, saveOrUpdate, removeOne };
