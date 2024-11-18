const express = require("express");
const Cart = require("../models/CartModel");
const {
  getCartItems,
  addItemCart,
  updateCart,
  deleteCart,
} = require("../Controllers/CartController");
const { protect, authorize } = require("../Middlewares/authentication");
const router = express.Router();

router.route("/").get(protect, getCartItems).post(protect, addItemCart);
router.route("/:id").put(updateCart).delete(deleteCart);

module.exports = router;
