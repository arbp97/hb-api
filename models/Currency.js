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

const { CURRENCY_API_KEY } = process.env;

const Model = mongoose.model("Currency", currencySchema);

getNewestRates = async (req) => {
  try {
    const response = await axios.get(
      "https://api.currencyapi.com/v3/latest?apikey=" + CURRENCY_API_KEY
    );
    req = response.data;
    return req.data;
  } catch (error) {
    return error;
  }
};

updateCurrencies = async () => {
  let currencies;
  let currArray = [];
  let status = "currencies updated";

  try {
    currencies = await getNewestRates(currencies);
  } catch (error) {
    return error;
  }

  for (const [key, data] of Object.entries(currencies)) {
    let newCurrency = new Model({
      iso: key,
      rate: data.value,
    });
    currArray.push(newCurrency);
  }

  // save or update changes to currency rates
  for (element of currArray) {
    let query = { iso: element.iso },
      update = { rate: element.rate },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
      await Model.updateOne(query, update, options);
    } catch (err) {
      status = err;
    }
  }

  return status;
};

findByCode = async (code) => {
  try {
    const currency = await Model.findOne({ iso: code });
    return currency;
  } catch (error) {
    return error;
  }
};

// returns converted rate (based in USD) of x amount represented in another currency rate
convertExchangeRates = (base, objective, amount) => {
  return (objective.rate / base.rate) * amount;
};

module.exports = {
  Model,
  getNewestRates,
  updateCurrencies,
  findByCode,
};
