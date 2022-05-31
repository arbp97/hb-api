import { UserModel } from "../models/User.js";
import { AccountModel } from "../models/Account.js";
import users from "./users.js";
import accounts from "./accounts.js";
import fs from "fs";
import path from "path";

// function to encode file data to base64 encoded string
const base64_encode = (file) => {
  return fs.readFileSync(file, "base64");
};

const loadData = async () => {
  for (let user of users) {
    user.img = base64_encode(
      path.join(path.resolve(path.dirname("")), "data", "img", user.img)
    );

    try {
      await new UserModel(user).save();
    } catch (error) {
      console.log(error);
    }
  }

  for (const account of accounts) {
    try {
      await new AccountModel(account).save();
    } catch (error) {
      console.log(error);
    }
  }

  console.log("data uploaded");
};

export default loadData;
