import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;
import { TransactionModel } from "../models/Transaction.js";
import { findByCode, convertExchangeRates } from "../models/Currency.js";

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
      const hashed = await hash(this.password, 10);
      this.password = hashed;
    }

    next();
  } catch (err) {
    return next(err);
  }
});

/* compares a saved hashed password with a given plain text one*/
accountSchema.methods.comparePassword = async function (candidatePassword) {
  const result = await compare(candidatePassword, this.password);
  return result;
};

accountSchema.methods.isActive = function () {
  return this.state === "active" ? true : false;
};

accountSchema.methods.transferTo = async function (destiny, amount, motive) {
  let result = { status: "success", error: [] };
  let baseCurrency = await findByCode(this.currency);
  let objCurrency = await findByCode(destiny.currency);

  // check if destiny account exists and is valid
  if (!this.isActive() || !destiny.isActive()) {
    result.status = "failed";
    result.error.push({ error: "Invalid Account" });
  }

  // check if there is enough funds in origin
  if (this.balance < amount) {
    result.status = "failed";
    result.error.push({ error: "Insufficient funds" });
  }

  // if everything is ok then proceed with transfer
  if (result.status === "success") {
    // convert amount to destiny currency rate
    let destCurrencyAmount = convertExchangeRates(
      baseCurrency,
      objCurrency,
      amount
    );

    // remove id & timestamps to save new instances
    let newOrigin = resetAccountAutoFields(this);
    let newDestiny = resetAccountAutoFields(destiny);

    newOrigin.balance -= amount;
    newDestiny.balance += destCurrencyAmount;
    // round balance after change
    newDestiny.balance = Number(newDestiny.balance.toFixed(2));

    result.status = "success";

    try {
      await newOrigin.save();
      await newDestiny.save();
    } catch (error) {
      result.error.push(error);
      result.status = "failed";
    }
  }

  try {
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
      state: result.status,
    };

    tmpTransaction = new TransactionModel(tmpTransaction);
    await tmpTransaction.save();
  } catch (error) {
    result.status = "failed";
    result.error.push(error);
  }

  return result;
};

export const AccountModel = model("Account", accountSchema);

export const findByCci = async (cci) => {
  try {
    const account = await AccountModel.find({ cciCode: cci })
      .sort({ _id: -1 })
      .limit(1);
    return account[0];
  } catch (error) {
    return error;
  }
};

export const findByMail = async (email) => {
  try {
    const account = await AccountModel.find({ email: email })
      .sort({ _id: -1 })
      .limit(1);
    return account[0];
  } catch (error) {
    return error;
  }
};

export const findByUser = async (dni) => {
  try {
    let accounts = await AccountModel.find({ owner: dni }).sort({
      cciCode: -1,
      _id: -1,
    });

    /*
      just include those which are unique.
      this works because accounts is already sorted
      by newest record & account CCI
      */
    accounts = (() => {
      let filtered = [];
      let newDocs = [];

      for (const account of accounts) {
        if (!filtered.includes(account.cciCode)) {
          filtered.push(account.cciCode);
          newDocs.push(account);
        }
      }

      return newDocs;
    })(accounts);

    return accounts;
  } catch (error) {
    return error;
  }
};

// returns new instance of doc without mongo auto fields
const resetAccountAutoFields = (doc) => {
  let newDoc = doc.toObject();
  delete newDoc._id;
  delete newDoc.createdAt;
  delete newDoc.updatedAt;
  return new AccountModel(newDoc);
};
