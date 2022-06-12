import { findByDni, pushHistory } from "../models/User.js";

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
  const { dni, name, surname, img, state } = req.body;

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

      const result = await user.save();

      res.status(result.error ? 400 : 200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
