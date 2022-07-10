import { findByDni, findByEmail, pushHistory } from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;

/** Find user by dni
 * @param { json } req dni: Number
 * @param {*} res response
 * @returns { json } User or error
 */
export async function find(req, res) {
  const { dni } = req.body;

  try {
    const user = await findByDni(dni);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function update(req, res) {
  const { dni, name, surname, email, password, img, state } = req.body;

  try {
    let user = await findByDni(dni);

    if (!user) {
      res.status(404).json({ error: "Not found" });
    } else {
      await pushHistory(user);

      user.name = name ? name : user.name;
      user.surname = surname ? surname : user.surname;
      user.img = img ? img : user.img;
      user.state = state ? state : user.state;
      user.email = email ? email : user.email;
      user.password = password ? password : user.password;

      const result = await user.save();

      res.status(result.error ? 400 : 200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/** authenticate user credentials
 * @param { json } req {email: string, password: string}
 * @param {*} res response
 * @returns { json } {email, token} or error
 */
export async function validate(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findByEmail(email);

    if (user) {
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        const token = sign({ email, dni: user.dni }, process.env.TOKEN_KEY, {
          expiresIn: "1h",
        });

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
