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

transactionSchema.pre("save", async function (next) {
  try {
    /**
     * Setting the transaction id to be n + 1 in relation
     * to the last one inserted (if exists)
     */
    if (this.transactionId < 0) {
      // if its not already set
      let lastInserted = await findLastInserted();

      if (!lastInserted) {
        // if a previous transaction doesnt exist
        this.transactionId = 0;
      } else {
        this.transactionId = lastInserted.transactionId + 1;
      }
    }
    next();
  } catch (err) {
    return next(err);
  }
});

const Model = mongoose.model("Transaction", transactionSchema);

findById = async (transactionId) => {
  let transaction;

  try {
    transaction = await Model.findOne({ transactionId: transactionId });
  } catch (err) {
    transaction = err;
  }
  return transaction;
};

findLastInserted = async () => {
  let result;

  try {
    result = await Model.find({}).sort({ _id: -1 }).limit(1);
    result = result[0];
  } catch (err) {
    result = err;
  }

  return result;
};

module.exports = { Model, findById, findLastInserted };
