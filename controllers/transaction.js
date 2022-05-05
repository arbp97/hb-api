const Transaction = require("../models/Transaction");

module.exports = {
  find: async function (req, res) {
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
  },
};
