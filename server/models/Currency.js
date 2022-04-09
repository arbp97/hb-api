const mongoose = require("mongoose");
const axios = require("axios");
const Schema = mongoose.Schema;

/* Uses CurrencyAPI
 * Documentation: https://currencyapi.com/docs/
 */

const currencySchema = new Schema(
  {
    iso: { type: String, required: true, index: { unique: true } },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

const Model = mongoose.model("Currency", currencySchema);

const getNewestRates = async (req) => {
  try {
    const response = await axios.get(
      "https://api.currencyapi.com/v3/latest?apikey=2ee230e0-9803-11ec-bd2a-db779118af45"
    );
    req = response.data;
    return req.data;
  } catch (error) {
    console.log(error);
  }
};

const updateCurrencies = async () => {
  let currencies;
  let currArray = [];

  try {
    currencies = await getNewestRates(currencies);
  } catch (error) {
    console.log(error);
  }

  for (const [key, data] of Object.entries(currencies)) {
    let newCurrency = new Model({
      iso: key,
      rate: data.value,
    });
    currArray.push(newCurrency);
  }

  // save or update changes to currency rates
  currArray.forEach(async (element) => {
    let query = { iso: element.iso },
      update = { rate: element.rate },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
      await Model.updateOne(query, update, options);
    } catch (err) {
      console.log(err);
    }
  });
};

const findByCode = async (code) => {
  let currency;

  try {
    currency = await Model.findOne({ iso: code });
  } catch (err) {
    currency = err;
  }
  return currency;
};

// returns converted rate (based in USD) of x amount represented in another currency rate
const convertExchangeRates = async (baseCurrency, desiredCurrency, amount) => {
  try {
    const base = await findByCode(baseCurrency);
    const objective = await findByCode(desiredCurrency);

    return (objective.rate / base.rate) * amount;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Model, updateCurrencies, findByCode, convertExchangeRates };
