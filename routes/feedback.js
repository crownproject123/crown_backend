const express = require("express");
const router = express.Router();

const feedbackController = require("../controller/feedback");

router.post("", authRequired, feedbackController.createNewFeedback);
router.get("", authRequired, feedbackController.getAllFeedback);
router.get("/:feedbackId", authRequired, feedbackController.getSingleFeedback);
router.patch("/:feedbackId", authRequired, feedbackController.updateFeedback);
router.delete("/:feedbackId", authRequired, feedbackController.deleteFeedback);

module.exports = router;
