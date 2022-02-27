const express = require("express");
const db = require("./database");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Card = require("./models/Card");
const Account = require("./models/Account");
const Currency = require("./models/Currency");
const { getNewestRates } = require("./util/currency-updates");

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
});

saveAll = async (user, account, card) => {
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
  } catch (err) {
    console.log("err" + err);
  }
  try {
    let saveCard = await card.save();
    console.log(saveCard);
  } catch (err) {
    console.log("err" + err);
  }

  currArray.forEach(async (element) => {
    try {
      let saveCurrency = await element.save();
      console.log(saveCurrency);
    } catch (err) {
      console.log("err" + err);
    }
  });
};

saveAll(testUser, testAccount, testCard);
