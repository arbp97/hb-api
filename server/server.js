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

let testUser = new User({
  dni: 12345678,
  name: "Peter",
  surname: "Jackson",
  state: "active",
});

let testAccount = new Account({
  accountNumber: "04400331122",
  owner: null, // set later
  currency: 1,
  cciCode: "112233445566",
  balance: 44000,
  email: "testmail@host.com",
  password: "password", //LOL
  state: "active",
});

let testCard = new Card({
  cardNumber: "4547131355550099",
  account: null,
  expireDate: "2023-02-22",
  state: "active",
  cardType: "CREDIT",
  pin: "1234",
});

let testTrans = new Transaction({
  origin: null,
  destiny: null,
  date: new Date(),
  amount: 500,
  currency: "ARS",
  motive: "beyond your understanding",
  state: "pending",
});

let currencies;
let currArray = [];

getNewestRates(currencies).then((currencies) => {
  for (const [key, value] of Object.entries(currencies)) {
    let newCurrency = new Currency({
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
      await Currency.updateOne(query, update, options, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
});

saveAll = async (user, account, card, transaction) => {
  try {
    //console.log("before save");
    let saveUser = await user.save(); //when fail its goes to catch
    console.log(saveUser); //when success it print.
    //console.log("after save");
    account.owner = saveUser.id;
  } catch (err) {
    console.log("err" + err);
  }
  try {
    let saveAccount = await account.save();
    console.log(saveAccount);
    card.account = saveAccount.id;
    transaction.origin = saveAccount.id;
    transaction.destiny = saveAccount.id;
  } catch (err) {
    console.log("err" + err);
  }
  try {
    let saveCard = await card.save();
    console.log(saveCard);
  } catch (err) {
    console.log("err" + err);
  }
  try {
    let saveTrans = await transaction.save();
    console.log(saveTrans);
  } catch (err) {
    console.log("err" + err);
  }
};

saveAll(testUser, testAccount, testCard, testTrans);
