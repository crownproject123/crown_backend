const express = require("express");
const router = express.Router();

const locationController = require("../controller/location");

router.post("", authRequired, locationController.createNewLocation);
router.get("", authRequired, locationController.getAllLocation);
router.get("/:locationId", authRequired, locationController.getSingleLocation);
router.patch("/:locationId", authRequired, locationController.updateLocation);
router.delete("/:locationId", authRequired, locationController.deleteLocation);
router.get("/:locationId/qr", locationController.getLocationQR);

module.exports = router;
