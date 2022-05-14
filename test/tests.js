import { UserModel } from "../models/User.js";
import { AccountModel } from "../models/Account.js";

// === Test Data ===
import * as Users from "../data/users.json" assert { type: "json" };
import * as Accounts from "../data/accounts.json" assert { type: "json" };

export const loadData = async () => {
  for (const U of Users.default) {
    try {
      await new UserModel(U).save();
    } catch (error) {
      console.log(error);
    }
  }

  for (const A of Accounts.default) {
    try {
      console.log(A);
      await new AccountModel(A).save();
    } catch (error) {
      console.log(error);
    }
  }

  console.log("json data uploaded");
};
