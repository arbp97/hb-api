const express = require("express");
const Account = require("./controllers/account");
const auth = require("./middleware/auth");

let router = express.Router();

router.get("/", (req, res) => res.json({ msg: "hola" }));

router.use("/account/find").post(auth, Account.find);
router.use("/account/validate").post(Account.validate);
router.use("/account/transfer").post(auth, Account.transfer);

module.exports = router;
