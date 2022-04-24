const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Transaction = require("../models/Transaction");
const Currency = require("../models/Currency");

const accountSchema = new Schema(
  {
    accountNumber: { type: String, required: true },
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
    password: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

// mongoose middleware to hash password before save/update
accountSchema.pre("save", async function (next) {
  try {
    /**
     * only hashes a password if the account is new or the password
     * itself is new. It would double hash it otherwise
     */
    const dbData = await findByCci(this.cciCode);
    let newOrUpdate = true;

    if (dbData) {
      const isMatch = await dbData.comparePassword(this.password);
      // if its equal AND hashed, then do not hash it again
      // if its equal but NOT hashed, hash
      // (its presumed that only hashed passwords are stored in db)
      if (!isMatch && dbData.password === this.password) newOrUpdate = false;
    }

    if (newOrUpdate) {
      const hashed = await bcrypt.hash(this.password, 10);
      this.password = hashed;
    }

    next();
  } catch (err) {
    return next(err);
  }
});

/* compares a saved hashed password with a given plain text one*/
accountSchema.methods.comparePassword = async function (candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
};

accountSchema.methods.isActive = function () {
  return this.state === "active" ? true : false;
};

accountSchema.methods.transferTo = async function (destiny, amount, motive) {
  let result = { msg: "", error: [] };
  let status = "failed";
  let baseCurrency = await Currency.findByCode(this.currency);
  let objCurrency = await Currency.findByCode(destiny.currency);

  // check if destiny account exists and is valid
  if (!this.isActive() || !destiny.isActive()) {
    result.msg = "account_invalid";
  } else {
    // check if there is enough money in origin
    if (this.balance < amount) {
      result.msg = "insufficient_funds";
    } else {
      // convert amount to destiny currency rate
      let destCurrencyAmount = convertExchangeRates(
        baseCurrency,
        objCurrency,
        amount
      );

      // if everything is correct, save changes to new instances
      let newOrigin = resetId(this);
      let newDestiny = resetId(destiny);

      newOrigin.balance -= amount;
      newDestiny.balance += destCurrencyAmount;
      // round balance after change
      newDestiny.balance = Number(newDestiny.balance.toFixed(2));

      status = "success";
      result.msg = "ok";

      try {
        await newOrigin.save();
        await newDestiny.save();
      } catch (error) {
        result.error.push(error);
        status = "failed";
        result.msg = "failed";
      }
    }
  }

  // save transaction attempt regardless of success
  let tmpTransaction = {
    transactionId: -1,
    origin: this.cciCode,
    destiny: destiny.cciCode,
    date: Date.now(),
    amount: amount,
    exchangeInfo: {
      baseIso: this.currency,
      objectiveIso: destiny.currency,
      baseRate: baseCurrency ? baseCurrency.rate : -1,
      objectiveRate: objCurrency ? objCurrency.rate : -1,
    },
    motive: motive,
    state: status,
  };

  try {
    tmpTransaction = new Transaction.Model(tmpTransaction);
    await tmpTransaction.save();
  } catch (error) {
    result.error.push(error);
  }

  return result;
};

const Model = mongoose.model("Account", accountSchema);

findByCci = async (cci) => {
  let account;

  try {
    account = await Model.find({ cciCode: cci }).sort({ _id: -1 }).limit(1);
    account = account[0];
  } catch (err) {
    account = err;
  }
  return account;
};

findByMail = async (email) => {
  let account;

  try {
    account = await Model.find({ email: email }).sort({ _id: -1 }).limit(1);
    account = account[0];
  } catch (err) {
    account = err;
  }
  return account;
};

// returns new instance of doc without _id
resetId = (doc) => {
  let newDoc = doc.toObject();
  delete newDoc._id;
  return new Model(newDoc);
};

module.exports = { Model, findByCci, findByMail, resetId };
