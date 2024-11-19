const { where } = require("sequelize");
const Order = require("../models/OrderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/CartModel");
const { get } = require("../Routes/orderRoute");
const { getAllProducts } = require("./ProductController");
const ErrorResponse = require("../utils/ErrorResponse");
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
  let total = 0;
  let prodArr = [];

  for (let i = 0; i < cartItems.length; i++) {
    console.log(cartItems[i].product_id);
    const product = await Product.findByPk(cartItems[i].product_id);
    prodArr.push(product.id);
    if (!product || product.stock < cartItems[i].quantity) {
      throw new Error(
        `Product ${product?.name || cartItems[i].productId} is out of stock`
      );
    }
    total = Math.ceil(total + product.price * cartItems[i].quantity);
    product.stock = product.stock - cartItems[i].quantity;
    await product.save();
  }

  const newOrder = await Order.create({
    user_id: req.user.id,
    total_price: total,
    status: "pending",
    product_id: prodArr,
  });

  // Clear the cart
  await Cart.destroy({ where: { user_id: req.user.id } });

  res.status(200).json({
    success: true,
    data: newOrder,
  });
});
