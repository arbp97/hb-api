const express = require("express");
const Account = require("./controllers/account");
const Transaction = require("./controllers/transaction");
const User = require("./controllers/user");
const auth = require("./middleware/auth");

let router = express.Router();

router.get("/", (req, res) => res.status(403).json({ msg: "GO AWAY" }));

// account routes
router.route("/account/find").post(auth, Account.find);
router.route("/account/validate").post(Account.validate);
router.route("/account/transfer").post(auth, Account.transfer);

// transaction routes
router.route("/transaction/find").post(auth, Transaction.find);

// user routes
router.route("/user/find").post(auth, User.find);

module.exports = router;
