const express = require("express");
const router = express.Router();

const accessoryController = require("../controller/accessory");

router.patch("", authRequired, accessoryController.updateAccessory);

module.exports = router;
