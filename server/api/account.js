const Account = require("../models/Account");
const Card = require("../models/Card");
const { Router } = require("express");
const router = Router();

/*
    test validation:
    should receive this object:
    {
        email : ...
        password : ...
    }
*/
router.post("/account/validate", async (req, res) => {
  let data = req.body;

  try {
    const account = await Account.findByMail(data.email);

    if (account) {
      const isMatch = await account.comparePassword(data.password);

      if (isMatch) {
        res.status(200).json({ msg: "ok" });
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
  let data = req.body;

  try {
    const account = await Account.findByMail(data.email);

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
        origin(cci) : ...
        destiny(cci)
        motive
        amount
    }
*/
router.post("/account/transfer", async (req, res) => {
  let data = req.body;

  try {
    let origin = await Account.findByCci(data.origin);

    if (origin) {
      const result = await origin.transferTo(
        data.destiny,
        data.amount,
        data.motive
      );

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
  let data = req.body;

  try {
    const account = await Account.findByCci(data.account);

    if (account) {
      const cards = await Card.findByAccount(account.cciCode);

      res.status(200).json(cards);
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
