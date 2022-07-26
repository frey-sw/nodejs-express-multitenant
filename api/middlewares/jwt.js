const jwt = require("jsonwebtoken");
const enumResultsBL = require("../business/enums/shared/result_status");

module.exports = (req, res, next) => {
  const authToken = req.get("Authorization")
    ? req.get("Authorization").substr(6)
    : "";

  // eslint-disable-next-line consistent-return
  jwt.verify(authToken, process.env.jwt_secret, (err, decoded) => {
    // eslint-disable-next-line no-bitwise
    const timeCurrent = (new Date().getTime() / 1000) | 0;
    if (err || timeCurrent >= decoded.exp) {
      return res.status(401).json({ status: enumResultsBL.NOT_AUTHENTICATED });
    }
    req.decodedToken = decoded;

    next();
  });
};
