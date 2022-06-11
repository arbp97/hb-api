import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;

const userSchema = new Schema(
  {
    dni: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    state: { type: String, required: true },
    img: {
      data: Buffer,
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);

export const findByDni = async (dni) => {
  try {
    const user = await UserModel.find({ dni: dni }).sort({ _id: -1 }).limit(1);
    return user;
  } catch (error) {
    return error;
  }
};

// returns new instance of doc without mongo auto fields
export const resetUserAutoFields = (doc) => {
  let newDoc = doc.toObject();
  delete newDoc._id;
  delete newDoc.createdAt;
  delete newDoc.updatedAt;
  return new UserModel(newDoc);
};
