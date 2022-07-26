const express = require("express");
const router = express.Router();

const enumResultBL = require("../business/enums/shared/result_status");
const accountsBL = require("../business/accounts");

/**
 * @swagger
 * /api/applications:
 *   post:
 *     security:
 *       - apiKey: []
 *     summary: Logout
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The user to logout.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Success Result
 *       400:
 *         description: Bad request
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/logout", async (req, res, next) => {
  try {
    const result = await accountsBL.logout(req.userEmail);

    switch (result.code) {
      case enumResultBL.SUCCESS:
        res.sendStatus(200);
        break;
      case enumResultBL.BAD_REQUEST:
        res.sendStatus(400);
        break;
      case enumResultBL.INVALID_CREDENTIALS:
        res.sendStatus(403);
        break;
      default:
        res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
