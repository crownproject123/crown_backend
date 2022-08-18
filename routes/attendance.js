const express = require("express");
const router = express.Router();

const attendanceController = require("../controller/attendance");

router.post("", authRequired, attendanceController.createNewAttendance);
router.post("/manual", authRequired, attendanceController.createAttendanceManually);
router.get("", authRequired, attendanceController.getAllAttendance);
router.get("/:attendanceId", authRequired, attendanceController.getSingleAttendance);
router.delete("/:attendanceId", authRequired, attendanceController.deleteAttendance);

module.exports = router;
