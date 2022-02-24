const User = require("../models/User");
const { Router } = require("express");
const router = Router();

router.get("/user/find", (req, res) => {
  User.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(404).json(null);
    } else {
      console.log(docs);
      res.status(200).json(docs);
    }
  });
});

router.get("/user/find/:dni", (req, res) => {
  const dni = req.params.dni;

  User.find({ dni: dni }, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(404).json(null);
    } else {
      console.log(docs);
      res.status(200).json(docs);
    }
  });
});

router.delete("/user/delete/:dni", (req, res) => {
  const dni = req.params.dni;

  User.deleteOne({ dni: dni }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).json(null);
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});

module.exports = router;
