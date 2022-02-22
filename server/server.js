const express = require("express");
const mongoose = require("mongoose");
const db = require("./Database");
const app = express();

const PORT = 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

const User = require("./models/User");

// create a user a new user
let testUser = new User({
  username: "jmar777",
  password: "Password",
});

testUser.save(function (err) {
  if (err) return handleError(err);
  // saved!
});
