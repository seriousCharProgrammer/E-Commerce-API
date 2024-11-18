const express = require("express");
const User = require("../models/UserModel");
const { signUp, login } = require("../Controllers/authController");

const { protect, authorize } = require("../Middlewares/authentication");
const router = express.Router();
router.route("/register").post(signUp);
router.route("/login").post(login);

module.exports = router;
