const express = require("express");
const router = express.Router();

const userController = require("./../controller/userController");
const authController = require("./../controller/authController");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

router.get("/", userController.getAllUsers);

module.exports = router;
