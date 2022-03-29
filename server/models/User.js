const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    dni: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const Model = mongoose.model("User", userSchema);

saveOrUpdate = async (user) => {
  let query = { dni: user.dni },
    update = { name: user.name, surname: user.surname, state: user.state },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  let result;
  try {
    result = await Model.updateOne(query, update, options);
  } catch (err) {
    result = err;
  }

  return result;
};

findByDni = async (dni) => {
  let user;

  try {
    user = await Model.findOne({ dni: dni });
  } catch (err) {
    user = err;
  }
  return user;
};

removeOne = async (user) => {
  let result;
  try {
    result = await Model.deleteOne({ dni: user.dni });
  } catch (err) {
    result = err;
  }

  return result;
};

module.exports = { Model, saveOrUpdate, findByDni, removeOne };
