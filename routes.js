const express = require("express");
const Account = require("./controllers/account");
const auth = require("./middleware/auth");

let router = express.Router();

router.route("/account/find").post(auth, Account.find);
router.route("/account/validate").post(Account.validate);
router.route("/account/transfer").post(auth, Account.transfer);

module.exports = router;
