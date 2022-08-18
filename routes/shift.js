const express = require("express");
const router = express.Router();

const shiftController = require("../controller/shift");

router.post("", authRequired, shiftController.createNewShift);
router.get("", authRequired, shiftController.getAllShift);
router.get("/:shiftId", authRequired, shiftController.getSingleShift);
router.patch("/:shiftId", authRequired, shiftController.updateShift);
router.delete("/:shiftId", authRequired, shiftController.deleteShift);

module.exports = router;
