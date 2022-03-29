const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    transactionId: { type: Number, required: true, index: { unique: true } },
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

transactionSchema.pre("updateOne", async function (next) {
  try {
    /**
     * Setting the transaction id to be n + 1 in relation
     * to the last one inserted (if exists)
     */
    let query = this.getQuery();

    if (!query["transactionId"]) {
      // if its not already set
      let lastInserted = await Model.find({}).sort({ _id: -1 }).limit(1);
      let newQuery = {};

      if (!lastInserted.length) {
        // if a previous transaction doesnt exist
        newQuery["transactionId"] = 0;
      } else {
        newQuery["transactionId"] = lastInserted[0].transactionId + 1;
      }

      this.setQuery(newQuery);
    }
    next();
  } catch (err) {
    return next(err);
  }
});

const Model = mongoose.model("Transaction", transactionSchema);

saveOrUpdate = async (transaction) => {
  let query = { transactionId: transaction.transactionId },
    update = {
      origin: transaction.origin, // check if active/exists
      destiny: transaction.destiny, // check //
      date: transaction.date,
      amount: transaction.amount, // check if origin balance enough
      currency: transaction.currency,
      motive: transaction.motive,
      state: transaction.state,
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  let result;
  try {
    result = await Model.updateOne(query, update, options);
  } catch (err) {
    result = err;
  }

  return result;
};

findById = async (transactionId) => {
  let transaction;

  try {
    transaction = await Model.findOne({ transactionId: transactionId });
  } catch (err) {
    transaction = err;
  }
  return transaction;
};

removeOne = async (transaction) => {
  let result;

  try {
    result = await Model.deleteOne({
      transactionId: transaction.transactionId,
    });
  } catch (err) {
    result = err;
  }

  return result;
};

module.exports = { Model, findById, saveOrUpdate, removeOne };
