const express = require("express");
const Account = require("./api/account");
const auth = require("./middleware/auth");

var router = express.Router();

router.route("/find").post(auth, Account.find);
router.route("/validate").post(Account.validate);
router.route("/transfer").post(auth, Account.transfer);

module.exports = router;
