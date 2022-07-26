const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const resultsBL = require("./enums/shared/result_status");

module.exports = {
  generateAccessToken: (jwtPayload) => {
    return jwt.sign(jwtPayload, process.env.jwt_secret, {
      expiresIn: parseInt(process.env.token_timeout_in_seconds),
    });
  },
  generateResetTokenExpirationDate: () => {
    let newResetTokenExpiration = new Date();

    newResetTokenExpiration.setTime(
      newResetTokenExpiration.getTime() +
        process.env.refresh_token_expiration * 60 * 60 * 1000
    );

    return newResetTokenExpiration;
  },
  checkPassword: async (pass, hashedPassword) => {
    return await bcrypt.compare(pass, hashedPassword);
  },
  generateHash: async (newPassword) => {
    return await bcrypt.hash(newPassword, 10);
  },
  log: async (loggingModel) => {
    console.log(
      "\n" +
        "api=" +
        loggingModel.api +
        " " +
        loggingModel.message +
        " date " +
        new Date()
    );
  },
};
