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
  const order = await Order.findByPk({ where: { id: req.params.id } });

  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const cartItems = await Cart.findAll({ where: { user_id: req.user.id } });
  console.log();

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  let arr = [];
  let num = 0;
  const products = cartItems.map((el) => el.product_id);
  const quantity = cartItems.map((el) => el.quantity);
  console.log(products, quantity);

  products.forEach(async (el) => {
    s = await Product.findOne({ where: { id: el } });
    arr.push(Number(s.price));
  });

  const pr = await Product.findOne({ where: { id: products[0] } });
  console.log(pr.price);
  console.log(arr);
  console.log(num);
  console.log(as);
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
