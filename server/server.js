const express = require("express");
const db = require("./database");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Card = require("./models/Card");
const Account = require("./models/Account");
const Currency = require("./models/Currency");
const Transaction = require("./models/Transaction");
const { getNewestRates } = require("./util/currency-updates");
const Users = require("./data/users.json");
const Accounts = require("./data/accounts.json");
const Cards = require("./data/cards.json");
const Transactions = require("./data/transactions.json");

app.use(cors());

app.set("json spaces", 2);

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//api routes
app.use(require("./api/user"));
app.use(require("./api/card"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

// ###testing schemas###

let currencies;
let currArray = [];

getNewestRates(currencies).then((currencies) => {
  for (const [key, value] of Object.entries(currencies)) {
    let newCurrency = new Currency.Model({
      iso: key,
      rate: value,
    });
    currArray.push(newCurrency);
  }

  // save or update changes to currency rates
  currArray.forEach(async (element) => {
    let query = { iso: element.iso },
      update = { rate: element.rate },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
      await Currency.Model.updateOne(
        query,
        update,
        options,
        function (err, docs) {
          if (err) {
            console.log(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
});

saveAll = async () => {
  for (let i = 0; i < Accounts.length; i++) {
    try {
      let newUser = new User.Model(Users.at(i));
      let saveUser = await newUser.save();
      console.log(saveUser);
      Accounts.at(i).owner = saveUser.id;
    } catch (err) {
      console.log("err" + err);
    }

    try {
      let newAccount = new Account.Model(Accounts.at(i));
      let saveAccount = await newAccount.save();
      console.log(saveAccount);
      Cards.at(i).account = saveAccount.id;
    } catch (err) {
      console.log("err" + err);
    }

    try {
      let newCard = new Card.Model(Cards.at(i));
      let saveCard = await newCard.save();
      console.log(saveCard);
    } catch (err) {
      console.log("err" + err);
    }
  }

  for (let j = 0; j < Transactions.length; j++) {
    try {
      let newTransaction = new Transaction.Model(Transactions.at(j));
      let saveTranstaction = await newTransaction.save();
      console.log(saveTranstaction);
    } catch (err) {
      console.log("err" + err);
    }
  }
};

saveAll();
/*
Account.findByCci("2224329878881230001765")
  .then((account) => {
    console.log(account);
  })
  .catch((error) => {
    console.log(error);
  });
*/
