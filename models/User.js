const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    dni: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const Model = mongoose.model("User", userSchema);

findByDni = async (dni) => {
  try {
    const user = await Model.find({ dni: dni }).sort({ _id: -1 }).limit(1);
    return user;
  } catch (error) {
    return error;
  }
};

// returns new instance of doc without _id
resetId = (doc) => {
  let newDoc = doc.toObject();
  delete newDoc._id;
  return new Model(newDoc);
};

module.exports = {
  Model,
  findByDni,
  resetId,
};
