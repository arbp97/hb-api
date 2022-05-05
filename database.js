//Import the mongoose module
let mongoose = require("mongoose");

const { MONGO_URI } = process.env;

//Set up mongoose connection

const connectDatabase = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);

    await mongoose.connect(MONGO_URI);
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
