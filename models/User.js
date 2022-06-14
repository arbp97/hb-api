import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;

const userSchema = new Schema(
  {
    dni: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    state: { type: String, required: true },
    img: {
      data: Buffer,
      type: String,
    },
  },
  { timestamps: true }
);

/* compares a saved hashed password with a given plain text one*/
userSchema.methods.comparePassword = async function (candidatePassword) {
  const result = await compare(candidatePassword, this.password);
  return result;
};

// mongoose middleware to hash password before save/update
userSchema.pre("save", async function (next) {
  try {
    /**
     * only hashes a password if the account is new or the password
     * itself is new. It would double hash it otherwise
     */
    const dbData = await findByDni(this.dni);
    let newOrUpdate = true;

    if (dbData) {
      const isMatch = await dbData.comparePassword(this.password);
      // if its equal AND hashed, then do not hash it again
      // if its equal but NOT hashed, hash
      // (its presumed that only hashed passwords are stored in db)
      if (!isMatch && dbData.password === this.password) newOrUpdate = false;
    }

    if (newOrUpdate) {
      const hashed = await hash(this.password, 10);
      this.password = hashed;
    }

    next();
  } catch (err) {
    return next(err);
  }
});

export const UserModel = model("User", userSchema);
export const UserHistoryModel = model("UserHistory", userSchema);

export const findByDni = async (dni) => {
  try {
    const user = await UserModel.findOne({ dni: dni });
    return user;
  } catch (error) {
    return error;
  }
};

export const findByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({ email: email });
    return user;
  } catch (error) {
    return error;
  }
};

// save documents into a history collection
export const pushHistory = async (user) => {
  let record = new UserHistoryModel(resetUserAutoFields(user));

  try {
    const result = await record.save();
    return result;
  } catch (error) {
    return error;
  }
};

// returns new instance of doc without mongo auto fields
const resetUserAutoFields = (doc) => {
  let newDoc = doc.toObject();
  delete newDoc._id;
  delete newDoc.createdAt;
  delete newDoc.updatedAt;
  return newDoc;
};
