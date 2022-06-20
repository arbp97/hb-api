import bcryptjs from "bcryptjs";
const { compare } = bcryptjs;

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyAccess = (req, res, next) => {
  const token = req.headers["token"] || req.body.token;
  const { TOKEN_KEY } = process.env;

  if (!token) {
    return res.status(403).json({ error: "Access token required" });
  }

  compare(TOKEN_KEY, token, (err, response) => {
    if (!response) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    return next();
  });
};

export default verifyAccess;
