const express = require("express");
const router = express.Router();

const accountsBL = require("../business/accounts");
const enumResultsBL = require("../business/enums/shared/result_status");

/**
 * @swagger
 * /api/applications:
 *   get:
 *     security:
 *       - apiKey: []
 *     summary: Get the logged user account info
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success Result
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.get("/accountInfo", async (req, res, next) => {
  let result;
  try {
    let accountResult = await accountsBL.getUserAccount(req.userCi);
    if (accountResult.code !== enumResultsBL.SUCCESS) {
      result = res.status(400).send({ status: accountResult.code });
    } else {
      result = res.status(200).json({
        status: accountResult.code,
        data: accountResult.data,
      });
    }
  } catch (error) {
    console.error(error);
    result = res.status(500);
  }
  return result;
});

module.exports = router;
