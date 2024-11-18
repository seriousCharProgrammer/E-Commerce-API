const express = require("express");
const Order = require("../models/OrderModel");
const {
  getAllOrders,
  getOneOrders,
  createOrder,
} = require("../Controllers/OrderController");
const { protect, authorize } = require("../Middlewares/authentication");
const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "buyer"), getAllOrders)
  .post(protect, authorize("buyer"), createOrder);
router.route("/:id").get(protect, authorize("admin", "buyer"), getOneOrders);

module.exports = router;
