const { where } = require("sequelize");
const Order = require("../models/OrderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/CartModel");
const { get } = require("../Routes/orderRoute");
const { getAllProducts } = require("./ProductController");
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.findAll({ where: { user_id: req.user.id } });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

exports.getOneOrders = asyncHandler(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const cartItems = await Cart.findAll({ where: { user_id: req.user.id } });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  const products = cartItems.map((el) => el.product_id);
  let prices = [];

  const leo = products.map(async (el) => {
    const s = await Product.findByPk(el);
    el = s.price;
  });
  console.log(products);
  console.log(prices);
  console.log(leo);

  /*
  const newOrder = await Order.create({
    user_id: req.user.id,
    total_price: prices,
    status: "pending",
    product_id: products,
  });

  // Clear the cart
  await Cart.destroy({ where: { user_id: req.user.id } });
*/
  res.status(200).json({
    success: true,
    data: newOrder,
  });
});
