import { findById, findByAccount } from "../models/Transaction.js";

/** Find transaction by id
 * @param { json } req transactionId: Number
 * @param {*} res response
 * @returns { json } Transaction or error
 */
export async function find(req, res) {
  const { transactionId } = req.body;
  const token = req.user;

  try {
    const transaction = await findById(transactionId);

    if (transaction) {
      const origin = transaction.origin;
      const destiny = transaction.destiny;

      // must be related to the transaction to fetch it
      if (origin !== token.cci || destiny !== token.cci) {
        res.status(403).json({ error: "Invalid token" });
      } else {
        res.status(200).json(transaction);
      }
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/** Find transactions by account
 * @param { json } req cci: cciCode
 * @param {*} res response
 * @returns { json } Transactions[] or error
 */
export async function findTransByAccount(req, res) {
  const { cci } = req.body;
  const token = req.user;

  if (cci !== token.cci) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  try {
    const transactions = await findByAccount(cci);

    if (transactions) {
      res.status(200).json(transactions);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
