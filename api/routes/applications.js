const express = require("express");
const router = express.Router();

const utils = require("../routes/utils");
const enumResultsBL = require("../business/enums/shared/result_status");

const applicationsIV = require("../input-validation/applications/applications");
const createApplicationsIV = require("../input-validation/applications/setApplications");
const applicationsBL = require("../business/applications");
const usersDA = require("../db/accounts");

/**
 * @swagger
 * /api/applications:
 *   get:
 *     security:
 *       - apiKey: []
 *     summary: Get Application list
 *     responses:
 *       200:
 *         description: Success Result
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/applications",
  (req, res, next) => {
    utils.validateInput(req.query, applicationsIV, res, next);
  },
  async (req, res, next) => {
    let result;
    try {
      let appRes = await applicationsBL.getApplications(
        req.query.page,
        req.query.size,
        req.query.orderBy,
        req.query.orderDirection,
        req.query.filterBy,
        req.query.searchText,
        req.userCi,
        req.userRol
      );
      if (appRes.code !== enumResultsBL.SUCCESS) {
        result = res.status(400).send({ status: appRes.code });
      } else {
        result = res.status(200).json({
          status: appRes.code,
          data: appRes.data,
        });
      }
    } catch (error) {
      console.error(error);
      result = res.status(500);
    }
    return result;
  }
);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     security:
 *       - apiKey: []
 *     summary: Create Application
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *             - amount
 *             - payments
 *             - dues
 *           properties:
 *             amount:
 *               type: integer
 *             payments:
 *               type: integer
 *             dues:
 *               type: integer
 *     responses:
 *       201:
 *         description: Success Result
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/applications",
  (req, res, next) => {
    utils.validateInput(req.body, createApplicationsIV, res, next);
  },
  async (req, res, next) => {
    let result;
    try {
      const {
        data: { id, ci, email },
      } = await usersDA.getByCI(req.userCi);

      const appRes = await applicationsBL.createApplications(
        req.body.amount,
        req.body.payments,
        req.body.dues,
        id,
        email,
        ci
      );

      if (appRes.code !== enumResultsBL.SUCCESS) {
        result = res.status(400).json();
      } else {
        result = res.status(201).json();
      }
    } catch (error) {
      console.error(error);
      result = res.status(500);
    }
    return result;
  }
);

module.exports = router;
