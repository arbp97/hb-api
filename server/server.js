const express = require("express");
const db = require("./database");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

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

const User = require("./models/User");
const Card = require("./models/Card");
const Account = require("./models/Account");

let testUser = new User({
  dni: 12345678,
  name: "Peter",
  surname: "Jackson",
  state: "active",
});

let testAccount = new Account({
  accountNumber: "04400331122",
  dni: 12345678,
  currencyId: 1,
  cciCode: "112233445566",
  balance: 44000,
  state: "active",
});

let testCard = new Card({
  cardNumber: "4547131355550099",
  assocAccountNumber: "04400331122",
  expireDate: "2023-02-22",
  state: "active",
  cardType: "CREDIT",
  pin: "1234",
});

testUser.save(function (err) {
  if (err) return console.log(err);
  // saved!
});

testCard.save(function (err) {
  if (err) return console.log(err);
  // saved!
});

testAccount.save(function (err) {
  if (err) return console.log(err);
  // saved!
});
