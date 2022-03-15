const Account = require("../models/Account");
const { Router } = require("express");
const router = Router();

/*
    test validation:
    should receive this json object:
    {
        email : ...
        password : ...
    }
*/
router.post("/account/validate", async (req, res) => {
  let data = req.body;

  try {
    let account = await Account.findByMail(data.email);

    if (account) {
      account.comparePassword(data.password, function (err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          res.status(200).json({ msg: "ok" });
        } else {
          res.status(400).json({ msg: "incorrect_password" });
        }
      });
    } else {
      res.status(404).json({ msg: "not_found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
