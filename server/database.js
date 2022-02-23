//Import the mongoose module
let mongoose = require("mongoose");

let dbUri = "mongodb://127.0.0.1/homebanking";
//Set up mongoose connection
/* #FIXME
 * This credentials are just for testing locally
 */

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

mongoose
  .connect(dbUri, {
    auth: { authSource: "admin" },
    user: "arbp97Admin",
    pass: "blangille123",
  })
  .then((result) => console.log("connected to database"))
  .catch((err) => console.log(err));
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
let Database = mongoose.connection;

module.exports = Database;
