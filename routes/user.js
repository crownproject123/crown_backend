const express = require("express");
const router = express.Router();

const userController = require("../controller/user");

router.post("", authRequired, userController.createNewUser);
router.get("", authRequired, userController.getAllUser);
router.get("/me", authRequired, userController.getMe);
router.get("/:userId", authRequired, userController.getSingleUser);
router.patch("/:userId", authRequired, userController.updateUser);
router.delete("/:userId", authRequired, userController.deleteUser);

module.exports = router;
