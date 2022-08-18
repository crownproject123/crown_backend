const express = require("express");
const router = express.Router();

const fcmController = require("../controller/fcm");

router.post("/register", authRequired, fcmController.registerFCMDevice);
router.delete("/unregister/:userId", fcmController.unregisterFCMDevice);
router.post("", fcmController.send);

module.exports = router;
