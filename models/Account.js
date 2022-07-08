import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;
import { TransactionModel } from "../models/Transaction.js";
import { findByEmail as userFindByEmail } from "./User.js";
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
    state: { type: String, required: true },
  },
  { timestamps: true }
);

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

    let newOrigin = this;
    let newDestiny = destiny;

    // save both records as they were before the transfer
    // into history
    pushHistory(this);
    pushHistory(destiny);

    newOrigin.balance -= amount;
    newDestiny.balance += Number(Number(destCurrencyAmount).toFixed(2));

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
export const AccountHistoryModel = model("AccountHistory", accountSchema);

export const findByCci = async (cci) => {
  try {
    const account = await AccountModel.findOne({ cciCode: cci });
    return account;
  } catch (error) {
    return error;
  }
};

export const findByAccountNumber = async (accountNumber) => {
  try {
    const account = await AccountModel.findOne({
      accountNumber: accountNumber,
    });
    return account;
  } catch (error) {
    return error;
  }
};

export const findByDni = async (dni) => {
  try {
    let accounts = await AccountModel.find({ owner: dni }).sort({
      cciCode: -1,
      _id: -1,
    });

    return accounts;
  } catch (error) {
    return error;
  }
};

export const findByEmail = async (email) => {
  try {
    const user = await userFindByEmail(email);

    let accounts = await AccountModel.find({ owner: user.dni }).sort({
      cciCode: -1,
      _id: -1,
    });

    return accounts;
  } catch (error) {
    return error;
  }
};

// save documents into a history collection
export const pushHistory = async (account) => {
  let record = new AccountHistoryModel(resetAccountAutoFields(account));

  try {
    const result = await record.save();
    return result;
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
  return newDoc;
};
