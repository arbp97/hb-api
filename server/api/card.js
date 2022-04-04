const Card = require("../models/Card");
const Account = require("../models/Account");
const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();

router.get("/card/find", auth, async (req, res) => {
  const { cardNumber } = req.body;

  try {
    const card = await Card.findByCardNumber(cardNumber);

    if (card) {
      res.status(200).json(card);
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
    }
*/
router.post("/card/account", auth, async (req, res) => {
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
