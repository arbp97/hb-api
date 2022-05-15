//Import the mongoose module
import pkg from "mongoose";
const { set, connect } = pkg;

const { MONGO_URI } = process.env;

//Set up mongoose connection

export const connectDatabase = async () => {
  try {
    await connect(MONGO_URI);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};
