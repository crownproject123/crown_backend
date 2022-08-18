const express = require("express");
const router = express.Router();
const authentication = require("../utils/authentication");
const authorizationController = require("../controller/authorization");

router.post("/create-admin", authorizationController.createdAdmin);
router.post("/login", authorizationController.login);

// Forgot password
router.post("/forgot-password", authorizationController.sendForgotPasswordLink);
router.patch("/forgot-password", authorizationController.setNewPassword);

module.exports = router;
