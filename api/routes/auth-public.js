const express = require("express");
const router = express.Router();

const enumResultBL = require("../business/enums/shared/result_status");
const loginIV = require("../input-validation/auth/login");
const refreshTokenIV = require("../input-validation/auth/refresh_token");
const accountsBL = require("../business/accounts");
const utils = require("./utils");
const ROL = require("../business/enums/users/user_types");

router.post(
  "/login",
  (req, res, next) => {
    utils.validateInput(req.body, loginIV, res, next);
  },
  async (req, res, next) => {
    let result;
    try {
      let resultBL = await accountsBL.login(req.body, ROL.USUARIO);
      if (resultBL.code !== enumResultBL.SUCCESS) {
        result = res.status(401).send({ status: resultBL.code });
      } else {
        result = res.status(200).json({
          status: resultBL.code,
          access_token: resultBL.accessToken,
          refresh_token: resultBL.refreshToken,
        });
      }
    } catch (error) {
      console.error(error);
      result = res.status(500);
    }
    return result;
  }
);

router.post(
  "/loginBackoffice",
  (req, res, next) => {
    utils.validateInput(req.body, loginIV, res, next);
  },
  async (req, res, next) => {
    let result;
    try {
      let resultBL = await accountsBL.login(req.body, ROL.ADMINISTRADOR);
      if (resultBL.code !== enumResultBL.SUCCESS) {
        result = res.status(401).send({ status: resultBL.code });
      } else {
        result = res.status(200).json({
          status: resultBL.code,
          access_token: resultBL.accessToken,
          refresh_token: resultBL.refreshToken,
        });
      }
    } catch (error) {
      console.error(error);
      result = res.status(500);
    }
    return result;
  }
);

router.post(
  "/refresh-token",
  (req, res, next) => {
    utils.validateInput(req.body, refreshTokenIV, res, next);
  },
  async (req, res, next) => {
    try {
      let businessResult = await accountsBL.refreshToken(req.body);

      switch (businessResult.code) {
        case enumResultBL.SUCCESS:
          res.status(200).json({
            access_token: businessResult.access_token,
          });
          break;
        case enumResultBL.BAD_REQUEST:
          res.sendStatus(400);
          break;
        case enumResultBL.INVALID_CODE:
          res.sendStatus(401);
          break;
        default:
          res.sendStatus(500);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
