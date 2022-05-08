const express = require("express");
const Account = require("./controllers/account");
const Transaction = require("./controllers/transaction");
const User = require("./controllers/user");
const auth = require("./middleware/auth");

let router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// account routes
router.route("/account/find").post(auth, Account.find);
router.route("/account/auth").post(Account.validate);
router.route("/account/transfer").post(auth, Account.transfer);

// transaction routes
router.route("/transaction/find").post(auth, Transaction.find);
router.route("/transactions/account").post(auth, Transaction.findByAccount);

// user routes
router.route("/user/find").post(auth, User.find);

module.exports = router;
