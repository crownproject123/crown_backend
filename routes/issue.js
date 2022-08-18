const express = require("express");
const router = express.Router();

const issueController = require("../controller/issue");

router.post("", authRequired, issueController.createNewIssue);
router.get("", authRequired, issueController.getAllIssue);
router.get("/:issueId", authRequired, issueController.getSingleIssue);
router.patch("/:issueId", authRequired, issueController.updateIssue);
router.delete("/:issueId", authRequired, issueController.deleteIssue);

module.exports = router;
