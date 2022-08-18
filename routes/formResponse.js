const express = require("express");
const router = express.Router();

const formResponseController = require("../controller/formResponse");

router.post("", authRequired, formResponseController.createNewFormResponse);
router.post("/send-form", authRequired, formResponseController.sendFormLink);
router.get("", authRequired, formResponseController.getAllFormResponse);
router.get("/:formResponseId", authRequired, formResponseController.getSingleFormResponse);
router.patch("/:formResponseId", authRequired, formResponseController.updateFormResponse);
router.delete("/:formResponseId", authRequired, formResponseController.deleteFormResponse);

module.exports = router;
