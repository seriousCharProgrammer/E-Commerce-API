const express = require("express");
const User = require("../models/UserModel");
const { signUp } = require("../Controllers/authController");
const router = express.Router();

router.route("/register").post(signUp);

module.exports = router;
