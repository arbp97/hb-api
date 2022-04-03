const Account = require("../models/Account");
const Card = require("../models/Card");
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
router.post("/account/find", async (req, res) => {
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
  const { account, destiny, motive, amount } = req.body;

  try {
    let origin = await Account.findByCci(account);

    if (origin) {
      const result = await origin.transferTo(destiny, amount, motive);

      if (result.msg === "ok") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } else {
      res.status(404).json({ msg: "origin_not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

/*
    should receive this object:
    {
        account(cci) : ...
    }
*/
router.post("/account/cards", async (req, res) => {
  const { account } = req.body;

  try {
    const origin = await Account.findByCci(account);

    if (origin) {
      const cards = await Card.findByAccount(origin.cciCode);

      res.status(200).json(cards);
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
