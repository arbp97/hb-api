const Account = require("../models/Account");
const jwt = require("jsonwebtoken");

module.exports = {
  /** Tranfer money between accounts
   * @param { json } req {origin: cciCode, destiny: cciCode, motive: string, amount: Number}
   * @param {*} res response
   * @returns { json } {status: string, error: []} or error
   */
  transfer: async function (req, res) {
    const { origin, destiny, motive, amount } = req.body;

    try {
      let originAcc = await Account.findByCci(origin);
      let destinyAcc = await Account.findByCci(destiny);
      if (originAcc && destinyAcc) {
        const result = await originAcc.transferTo(destinyAcc, amount, motive);

        if (result.status === "success") {
          res.status(200).json(result);
        } else {
          res.status(400).json(result);
        }
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  /** Find account by email
   * @param { json } req email: string
   * @param {*} res response
   * @returns { json } Account or error
   */
  find: async function (req, res) {
    const { email } = req.body;

    try {
      const account = await Account.findByMail(email);

      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  /** authenticate account credentials
   * @param { json } req {email: string, password: string}
   * @param {*} res response
   * @returns { json } {email, token} or error
   */
  validate: async function (req, res) {
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
              expiresIn: "1h",
            }
          );

          res.status(200).json({ email, token });
        } else {
          res.status(400).json({ error: "Incorrect password" });
        }
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
