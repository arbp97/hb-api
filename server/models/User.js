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
    await Model.updateOne(query, update, options, function (err, docs) {
      if (err) {
        console.log(err);
        result = err;
      } else result = docs;
    });
  } catch (err) {
    console.log(err);
  }

  return result;
};

findByDni = async (dni) => {
  let user;

  try {
    await Model.findOne({ dni: dni }, function (err, docs) {
      if (err) {
        console.log(err);
        user = err;
      } else user = docs;
    });
  } catch (err) {
    console.log(err);
  }
  return user;
};

removeOne = async (user) => {
  let result;
  try {
    await Model.deleteOne({ dni: user.dni }, function (err, docs) {
      if (err) {
        console.log(err);
        result = err;
      } else result = docs;
    });
  } catch (err) {
    console.log(err);
  }

  return result;
};

module.exports = { Model, saveOrUpdate, findByDni, removeOne };
