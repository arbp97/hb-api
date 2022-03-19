const Card = require("../models/Card");
const { Router } = require("express");
const router = Router();

router.get("/card/find", (req, res) => {
  let data = req.body;

  try {
    let card = await Card.findByCardNumber(data.cardNumber);

    if (card) {
      res.status(200).json(card);
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
