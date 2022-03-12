const Account = require("../models/Account");
const { Router } = require("express");
const router = Router();

/*
    test validation:
    should receive this json object:
    {
        email : ...
        pass : ...
    }
*/
router.post("/account/validate", (req, res) => {
  let data = req.body;
  //console.log("BODY" + data.email);
  Account.findByMail(data.email)
    .then((account) => {
      //console.log("ACC" + account);

      if (account) {
        account.comparePassword(data.password, function (err, isMatch) {
          if (err) throw err;

          if (isMatch) {
            res.status(200).json({ msg: "welcome back" });
          } else {
            res.status(400).json({ msg: "incorrect password" });
          }
        });
      } else {
        res.status(404).json({ msg: "email not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ msg: error });
    });
});

module.exports = router;
