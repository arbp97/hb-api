import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken;

/**
this middleware is activated when specified in the api route
  in case a token is required, a valid token should
  be sent with the request.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyToken = (req, res, next) => {
  const token = req.headers["stp-token"];

  if (!token) {
    return res.status(403).json({ error: "Access token required" });
  }
  try {
    const decoded = verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "invalid access token" });
  }
  return next();
};

export default verifyToken;
