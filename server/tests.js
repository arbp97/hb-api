const User = require("./models/User");
const Card = require("./models/Card");
const Account = require("./models/Account");
const Currency = require("./models/Currency");
const Transaction = require("./models/Transaction");

executeTests = async () => {
  /*Account.findByCci("0001117773217580000654")
    .then((account) => {
      console.log(account);
      let accUpdate = account;
      accUpdate.currency = "RUB";
      Account.saveOrUpdate(accUpdate)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
    */
  let testUser = new User.Model({
    dni: 12345678,
    name: "Pedro",
    surname: "Jacinto",
    state: "active",
  });

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

  /*Account.findByCci("0883339876110009001110")
    .then((account) => {
      console.log(account);

      Account.removeOne(account)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
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

  /*Account.Model.findOne(
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

  try {
    let testConvert = await Currency.convertExchangeRates("USD", "ARS", 1);

    console.log(testConvert);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { executeTests };
