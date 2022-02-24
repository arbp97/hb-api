const Card = require("../models/Card");
const { Router } = require("express");
const router = Router();

router.get("/card/find", (req, res) => {
  Card.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(404).json(null);
    } else {
      console.log(docs);
      res.status(200).json(docs);
    }
  });
});

/*
    test validation:
    should receive this object:
    {
        cardNumber : ...
        pin : ...
    }
*/
router.get("/card/validate", (req, res) => {
  let card = req.body;

  Card.find(
    { cardNumber: card.cardNumber, pin: card.pin },
    function (err, docs) {
      if (err) {
        console.log(err);
        res.status(404).json(null);
      } else {
        console.log(docs);
        res.status(200).json(docs);
      }
    }
  );
});

module.exports = router;
