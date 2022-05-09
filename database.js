//Import the mongoose module
import pkg from "mongoose";
const { set, connect } = pkg;

const { MONGO_URI } = process.env;

//Set up mongoose connection

const connectDatabase = async () => {
  try {
    set("useNewUrlParser", true);
    set("useUnifiedTopology", true);
    set("useCreateIndex", true);
    set("useFindAndModify", false);

    await connect(MONGO_URI);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectDatabase };
