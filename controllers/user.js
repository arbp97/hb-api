const User = require("../models/User");

module.exports = {
  find: async function (req, res) {
    const { dni } = req.body;

    try {
      const user = await User.findByDni(dni);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
