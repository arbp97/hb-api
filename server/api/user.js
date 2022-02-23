const User = require("../models/User");
const { Router } = require("express");
const router = Router();

router.get("/user", (req, res) => {
  res.json({
    Title: "Testing",
  });
});

module.exports = router;
