const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Transaction = require("../models/Transaction");
const Currency = require("../models/Currency");

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
    cciCode: { type: String, required: true }, // could be index too
    balance: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

// mongoose middleware to hash password before save/update
accountSchema.pre("updateOne", async function (next) {
  try {
    /**
     * this._update.password references the update object
     * passed as parameter in saveOrUpdate function.
     * We check if exists just to be safe.
     */
    if (this._update.password) {
      const hashed = await bcrypt.hash(this._update.password, 10);
      this._update.password = hashed;
    }
    next();
  } catch (err) {
    return next(err);
  }
});

/* compares a saved hashed password with a given plain text one
 perhaps convert to async/await instead of callback? later..*/
accountSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

accountSchema.methods.transferTo = async function (cciCode, amount, motive) {
  let result = { msg: "", error: [] };
  let tmpTransaction = {
    transactionId: null,
    origin: this.cciCode,
    destiny: cciCode,
    date: Date.now(),
    amount: amount,
    currency: this.currency,
    motive: motive,
    state: "failed",
  };

  // check if there is enough money in origin
  if (this.amount < amount) {
    result.msg = "insufficient_funds";
  } else {
    let destiny = await findByCci(cciCode);

    // check if destiny account exists and is valid
    if (!destiny || destiny.state != "active") {
      result.msg = "account_not_found";
    } else {
      // convert amount to destiny currency rate
      let destCurrencyAmount = await convertExchangeRates(
        this.currency,
        destiny.currency,
        amount
      );

      // if everything is correct, save changes
      this.balance = this.balance - amount;
      destiny.balance = destiny.balance + destCurrencyAmount;

      tmpTransaction.state = "success";
      result.msg = "ok";

      try {
        await saveOrUpdate(this);
        await saveOrUpdate(destiny);
      } catch (error) {
        result.error.push(error);
      }
    }
  }

  // save transaction attempt regardless of success
  try {
    await Transaction.saveOrUpdate(tmpTransaction);
  } catch (error) {
    result.error.push(error);
  }

  return result;
};

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
    result = await Model.updateOne(query, update, options);
  } catch (err) {
    result = err;
  }

  return result;
};

findByCci = async (cci) => {
  let account;

  try {
    account = await Model.findOne({ cciCode: cci });
  } catch (err) {
    account = err;
  }
  return account;
};

findByMail = async (email) => {
  let account;

  try {
    account = await Model.findOne({ email: email });
  } catch (err) {
    account = err;
  }
  return account;
};

removeOne = async (account) => {
  let result;
  try {
    result = await Model.deleteOne({ cciCode: account.cciCode });
  } catch (err) {
    result = err;
  }

  return result;
};

module.exports = { Model, findByCci, saveOrUpdate, removeOne, findByMail };
