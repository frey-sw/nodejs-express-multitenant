const express = require("express");
const router = express.Router();

router.get("/loans", (req, res, next) => {
  let result;
  try {
    result =  res.status(200).json({
      company_id: req.tenantId,
      montosDePrestamos: [5000, 10000, 15000, 20000],
      cantidadDeCuotas: [3, 6, 9, 12],
      interesMensual: 0.05,
    });
  } catch (error) {
    console.error(error);
    result = res.status(500);
  }
  return result;
});

module.exports = router;
