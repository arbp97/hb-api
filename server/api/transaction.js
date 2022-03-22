const Transaction = require("../models/Transaction");
const { Router } = require("express");
const router = Router();

router.post("/transaction/find", async (req, res) => {
  let data = req.body;

  try {
    let transaction = await Transaction.findById(data.transactionId);

    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
