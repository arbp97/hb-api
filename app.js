import "dotenv/config";
import express from "express";
import { connectDatabase } from "./database.js";
import bodyParser from "body-parser";
const { urlencoded, json } = bodyParser;
import cors from "cors";
import { updateCurrencies } from "./models/Currency.js";
import routes from "./routes.js";

const app = express();

connectDatabase().then(() => {
  console.log("connection succesful");
});

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

app.use(express.static("public/"));

//api routes
app.use("/", routes);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// get updated currency rates info every 15min
setInterval(updateCurrencies, 900000);

app.listen(port, console.log(`Server started on port ${port}`));

export default app;
