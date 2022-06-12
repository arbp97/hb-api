import { findByDni, UserModel } from "../models/User.js";

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

export async function save(req, res) {
  const { dni, name, surname, img, state } = req.body;

  try {
    const user = {
      dni: dni,
      name: name,
      surname: surname,
      img: img ? img : null,
      state: state,
    };
    const result = await new UserModel(user).save();

    res.status(result.error ? 400 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
