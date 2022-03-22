//Import the mongoose module
let mongoose = require("mongoose");

let dbUri = "mongodb://127.0.0.1/homebanking";
//Set up mongoose connection
/* #FIXME
 * This credentials are just for testing locally
 */

const connectDatabase = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);

    await mongoose.connect(dbUri, {
      auth: { authSource: "admin" },
      user: "arbp97Admin",
      pass: "blangille123",
    });
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;

    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDatabase };
