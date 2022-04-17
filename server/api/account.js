const Account = require("../models/Account");
const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

/*
    should receive this object:
    {
        email : ...
        password : ...
    }
*/
router.post("/account/validate", async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findByMail(email);

    if (account) {
      const isMatch = await account.comparePassword(password);

      if (isMatch) {
        const token = jwt.sign(
          { account_id: account._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        res.status(200).json({ account, token });
      } else {
        res.status(400).json({ msg: "incorrect_password" });
      }
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

/*
    should receive this object:
    {
        email : ...
    }
*/
router.post("/account/find", auth, async (req, res) => {
  const { email } = req.body;

  try {
    const account = await Account.findByMail(email);

    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

/*
    should receive this object:
    {
        account(cci) : ...
        destiny(cci)
        motive
        amount
    }
*/
router.post("/account/transfer", auth, async (req, res) => {
  const { origin, destiny, motive, amount } = req.body;

  try {
    let originAcc = await Account.findByCci(origin);
    let destinyAcc = await Account.findByCci(destiny);
    if (originAcc && destinyAcc) {
      const result = await originAcc.transferTo(destinyAcc, amount, motive);

      if (result.msg === "ok") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } else {
      res.status(404).json({ msg: "account_not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
