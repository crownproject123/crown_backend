const express = require("express");
const router = express.Router();

const filledChecklistController = require("../controller/filledChecklist");

router.post("", authRequired, filledChecklistController.createNewFilledChecklist);
router.get("", authRequired, filledChecklistController.getAllFilledChecklist);
router.get("/:filledChecklistId", authRequired, filledChecklistController.getSingleFilledChecklist);
router.delete("/:filledChecklistId", authRequired, filledChecklistController.deleteFilledChecklist);

module.exports = router;
