const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, index: { unique: true } },
    origin: {
      type: String, //cciCode
      ref: "transaction",
      required: true,
    },
    destiny: {
      type: String, //cciCode
      ref: "transaction",
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

saveOrUpdate = async (transaction) => {
  let query = { transactionId: transaction.transactionId },
    update = {
      origin: transaction.origin,
      destiny: transaction.destiny,
      date: transaction.date,
      amount: transaction.amount,
      currency: transaction.currency,
      motive: transaction.motive,
      state: transaction.state,
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

findById = async (transactionId) => {
  let transaction;

  try {
    await Model.findOne({ transactionId: transactionId }, function (err, docs) {
      if (err) {
        console.log(err);
        transaction = err;
      } else transaction = docs;
    });
  } catch (err) {
    console.log(err);
  }
  return transaction;
};

removeOne = async (transaction) => {
  let result;
  try {
    await Model.deleteOne(
      { transactionId: transaction.transactionId },
      function (err, docs) {
        if (err) {
          console.log(err);
          result = err;
        } else result = docs;
      }
    );
  } catch (err) {
    console.log(err);
  }

  return result;
};

module.exports = { Model, findById, saveOrUpdate, removeOne };
