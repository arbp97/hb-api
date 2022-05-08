const Transaction = require("../models/Transaction");

module.exports = {
  find: async function (req, res) {
    const { transactionId } = req.body;

    try {
      const transaction = await Transaction.findById(transactionId);

      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  findByAccount: async function (req, res) {
    const { cci } = req.body;

    try {
      const transactions = await Transaction.findByAccount(cci);

      if (transactions) {
        res.status(200).json(transactions);
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
