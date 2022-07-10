/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyAccess = (req, res, next) => {
  const token = req.body.token || req.headers["token"];
  const { TOKEN_KEY } = process.env;

  if (!token) {
    return res.status(403).json({ error: "Access token required" });
  } else if (token !== TOKEN_KEY) {
    return res.status(401).json({ error: "Invalid access token" });
  }

  return next();
};

export default verifyAccess;
