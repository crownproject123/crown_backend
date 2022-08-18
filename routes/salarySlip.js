const express = require("express");
const router = express.Router();

const salarySlipController = require("../controller/salarySlip");

router.post("", authRequired, salarySlipController.createNewSalarySlip);
router.get("", authRequired, salarySlipController.getAllSalarySlip);
router.get("/:salarySlipId", authRequired, salarySlipController.getSingleSalarySlip);
router.delete("/:salarySlipId", authRequired, salarySlipController.deleteSalarySlip);

module.exports = router;
