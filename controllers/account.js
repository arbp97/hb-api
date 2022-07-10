import {
  findByCci,
  findByDni,
  findByEmail,
  findByAccountNumber,
} from "../models/Account.js";

/** Tranfer money between accounts
 * @param { json } req {origin: cciCode, destiny: cciCode, motive: string, amount: Number}
 * @param {*} res response
 * @returns { json } {status: string, error: []} or error
 */
export async function transfer(req, res) {
  const { origin, destiny, motive, amount } = req.body;
  const token = req.user;

  try {
    let originAcc = await findByCci(origin);
    let destinyAcc = await findByCci(destiny);

    if (originAcc && destinyAcc) {
      if (originAcc.owner !== token.dni) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }

      const result = await originAcc.transferTo(destinyAcc, amount, motive);

      if (result.status === "success") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/** find function for various inputs
 * @param { json } req accountNumber || cci
 * @param {*} res response
 * @returns { json } Account or error
 */
export async function find(req, res) {
  const { accountNumber, cciCode } = req.body;

  try {
    let account;

    if (accountNumber) account = await findByAccountNumber(accountNumber);
    else if (cciCode) account = await findByCci(cciCode);

    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/** Find accounts by user
 * @param { json } req dni || email
 * @param {*} res response
 * @returns { json } Accounts[] or error
 */
export async function findByUser(req, res) {
  const { dni, email } = req.body;

  try {
    const accounts = dni ? await findByDni(dni) : await findByEmail(email);

    if (accounts) {
      res.status(200).json(accounts);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
