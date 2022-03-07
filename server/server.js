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

// loading data in DB

Currency.updateCurrencies();

saveAll = async () => {
  for (let i = 0; i < Accounts.length; i++) {
    try {
      let newUser = new User.Model(Users.at(i));
      let saveUser = await newUser.save();
      console.log(saveUser);
    } catch (err) {
      console.log("err" + err);
    }

    try {
      let newAccount = new Account.Model(Accounts.at(i));
      let saveAccount = await newAccount.save();
      console.log(saveAccount);
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

//saveAll();

const { executeTests } = require("./tests");

executeTests();
