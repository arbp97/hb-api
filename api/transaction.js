const Transaction = require("../models/Transaction");
const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();

router.post("/api/transaction/find", auth, async (req, res) => {
  const { transactionId } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);

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
