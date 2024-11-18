const express = require("express");
const Cart = require("../models/CartModel");
const { getCartItems } = require("../Controllers/CartController");
const { protect, authorize } = require("../Middlewares/authentication");
const router = express.Router();

router.route("/").get(getCartItems);

module.exports = router;
