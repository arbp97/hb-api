const jwt = require("jsonwebtoken");

/*
  this middleware is activated when specified in the api route
  in case a token is required, a valid token should
  be sent with the request.
*/

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ msg: "access_token_required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ msg: "invalid_access_token" });
  }
  return next();
};

module.exports = verifyToken;
