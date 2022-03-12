const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

// compares a saved hashed password with a given plain text one
// perhaps convert to async/await instead of callback? later..
accountSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
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

findByMail = async (email) => {
  let account;

  try {
    await Model.findOne({ email: email }, function (err, docs) {
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

module.exports = { Model, findByCci, saveOrUpdate, removeOne, findByMail };
