import "dotenv/config";
import express from "express";
import { connectDatabase } from "./database.js";
import bodyParser from "body-parser";
const { urlencoded, json } = bodyParser;
import cors from "cors";
import { updateCurrencies } from "./models/Currency.js";
import routes from "./routes.js";

const app = express();

// allow requests from all origins -- change later
app.use(
  cors({
    origin: "*",
  })
);

app.set("json spaces", 2);

//middleware
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(express.static("public"));

//api routes
app.use("/", routes);

const { PORT } = process.env;
const port = PORT || 5000;

connectDatabase().then(() => {
  // get updated currency rates info every day
  setInterval(updateCurrencies, 86400 * 1000);

  app.listen(port, "0.0.0.0", () => {
    console.log(`App listening at PORT ${port}`);
  });
});

export default app;
