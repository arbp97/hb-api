//Import the mongoose module
let mongoose = require("mongoose");

let dbUri =
  "mongodb+srv://arbp97:p5JCYkkoZPVOSK6H@cluster0.oyjuy.mongodb.net/homebanking?retryWrites=true&w=majority";

//Set up mongoose connection

const connectDatabase = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);

    await mongoose.connect(dbUri);
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;

    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDatabase };
