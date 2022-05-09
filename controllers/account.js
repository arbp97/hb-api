import { findByCci, findByMail } from "../models/Account.js";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;

/** Tranfer money between accounts
 * @param { json } req {origin: cciCode, destiny: cciCode, motive: string, amount: Number}
 * @param {*} res response
 * @returns { json } {status: string, error: []} or error
 */
export async function transfer(req, res) {
  const { origin, destiny, motive, amount } = req.body;

  try {
    let originAcc = await findByCci(origin);
    let destinyAcc = await findByCci(destiny);
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
}

/** Find account by email
 * @param { json } req email: string
 * @param {*} res response
 * @returns { json } Account or error
 */
export async function find(req, res) {
  const { email } = req.body;

  try {
    const account = await findByMail(email);

    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/** authenticate account credentials
 * @param { json } req {email: string, password: string}
 * @param {*} res response
 * @returns { json } {email, token} or error
 */
export async function validate(req, res) {
  const { email, password } = req.body;

  try {
    const account = await findByMail(email);

    if (account) {
      const isMatch = await account.comparePassword(password);

      if (isMatch) {
        const token = sign(
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
}
