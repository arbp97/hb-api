import "dotenv/config";
import express from "express";
import { connectDatabase } from "./database.js";
import bodyParser from "body-parser";
const { urlencoded, json } = bodyParser;
import cors from "cors";
// === Models ===
import { UserModel } from "./models/User.js";
import { AccountModel } from "./models/Account.js";
import { updateCurrencies } from "./models/Currency.js";
import { TransactionModel } from "./models/Transaction.js";
// === Test Data ===
//import * as Users from "./data/users.json" assert { type: "json" };
//import * as Accounts from "./data/accounts.json" assert { type: "json" };
//import * as Transactions from "./data/transactions.json" assert { type: "json" };

import routes from "./routes.js";

const app = express();

connectDatabase();

// allow requests from all origins -- change later
app.use(
  cors({
    origin: "*",
  })
);

app.set("json spaces", 2);

//middleware
app.use(urlencoded({ extended: false }));
app.use(json());

//api routes
app.use("/", routes);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// loading data in DB

const saveAll = async (loadFromJson) => {
  const currencyStatus = await updateCurrencies();
  console.log(currencyStatus);
  /*
  if (loadFromJson) {
    for (const U of Users) {
      try {
        await new UserModel(U).save();
      } catch (error) {
        console.log(error);
      }
    }

    for (const A of Accounts) {
      try {
        await new AccountModel(A).save();
      } catch (error) {
        console.log(error);
      }
    }

    for (const T of Transactions) {
      try {
        await new TransactionModel(T).save();
      } catch (error) {
        console.log(error);
      }
    }

    console.log("json data uploaded");
  }*/
};

// get updated currency rates info every 15min
setInterval(saveAll, 900000, false);

//saveAll(false);

app.listen(port, console.log(`Server started on port ${port}`));

export default app;
