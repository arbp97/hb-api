const User = require("./models/User");
const Card = require("./models/Card");
const Account = require("./models/Account");
const Currency = require("./models/Currency");
const Transaction = require("./models/Transaction");

executeTests = async () => {
  /*User.saveOrUpdate(testUser)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });*/

  /*User.removeOne(testUser)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });*/

  /*Currency.findByCode("RUB")
    .then((currency) => {
      console.log(currency);
    })
    .catch((error) => {
      console.log(error);
    });*/

  let account1 = await Account.findByCci("0883339876110009001110");

  let isMatch = await account1.comparePassword("BushidoTrooper123");

  console.log(isMatch);

  /*
  Account.Model.findOne(
    { cciCode: "0001117773217580000654" },
    function (err, account) {
      if (err) throw err;

      // test a matching password
      account.comparePassword("tipitoEnojadito123", function (err, isMatch) {
        if (err) throw err;
        console.log("match:", isMatch); // -> Password123: true
      });
    }
  );*/
  /*
  try {
    let testConvert = await Currency.convertExchangeRates("RUB", "ARS", 12);

    console.log(testConvert);
  } catch (error) {
    console.log(error);
  }*/
  /*
  try {
    // find last inserted (!!!!!RETURNS AN ARRAY)
    let testLast = await Transaction.Model.find({}).sort({ _id: -1 }).limit(1);

    console.log(testLast);
  } catch (error) {
    console.log(error);
  }*/
};

module.exports = { executeTests };
