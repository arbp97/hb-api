if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env" });
}

const express = require("express");
const db = require("./database");
const bodyParser = require("body-parser");
const cors = require("cors");
// === Models ===
const User = require("./models/User");
const Account = require("./models/Account");
const Currency = require("./models/Currency");
const Transaction = require("./models/Transaction");
// === Test Data ===
const Users = require("./data/users.json");
const Accounts = require("./data/accounts.json");
const Transactions = require("./data/transactions.json");

const routes = require("./routes");

const app = express();

db.connectDatabase();

app.use(cors());

app.set("json spaces", 2);

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//api routes
app.use("/", routes);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// loading data in DB

saveAll = async (loadFromJson) => {
  const currencyStatus = await Currency.updateCurrencies();
  console.log(currencyStatus);

  if (loadFromJson) {
    for (const U of Users) {
      try {
        await new User.Model(U).save();
      } catch (error) {
        console.log(error);
      }
    }

    for (const A of Accounts) {
      try {
        await new Account.Model(A).save();
      } catch (error) {
        console.log(error);
      }
    }

    for (const T of Transactions) {
      try {
        await new Transaction.Model(T).save();
      } catch (error) {
        console.log(error);
      }
    }

    console.log("json data uploaded");
  }
};

// get updated currency rates info every 15min
setInterval(saveAll, 900000, false);

saveAll(false);

app.listen(port, console.log(`Server started on port ${port}`));

module.exports = app;
