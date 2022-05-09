import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;

const exchangeInfoSchema = new Schema({
  baseIso: { type: String, required: true },
  objectiveIso: { type: String, required: true },
  baseRate: { type: Number, required: true },
  objectiveRate: { type: Number, required: true },
});

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
    exchangeInfo: { type: exchangeInfoSchema, required: true },
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
        // if a previous transaction doesn't exist
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

const TransactionModel = model("Transaction", transactionSchema);

const findById = async (transactionId) => {
  try {
    const transaction = await TransactionModel.findOne({
      transactionId: transactionId,
    });
    return transaction;
  } catch (error) {
    return error;
  }
};

const findByAccount = async (cciCode) => {
  try {
    const transactions = await TransactionModel.find({ origin: cciCode });
    return transactions;
  } catch (error) {
    return error;
  }
};

const findLastInserted = async () => {
  try {
    const result = await TransactionModel.find({}).sort({ _id: -1 }).limit(1);
    return result[0];
  } catch (error) {
    return error;
  }
};

export { TransactionModel, findById, findByAccount, findLastInserted };
