const { where } = require("sequelize");
const Order = require("../models/OrderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/CartModel");
const { get } = require("../Routes/orderRoute");
const { getAllProducts } = require("./ProductController");
const ErrorResponse = require("../utils/ErrorResponse");
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  //const orders = await Order.findAll({ where: { user_id: req.user.id } });

  let queryOptions = {};

  // Handling `gt`, `gte`, `lt`, `lte`, `in` in the query string
  Object.keys(req.query).forEach((key) => {
    if (key.match(/(gt|gte|lt|lte|in)/)) {
      queryOptions.where = queryOptions.where || {};
      const operator = `$${key}`;
      queryOptions.where[key] = req.query[key];
    }
  });

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(", ");
    queryOptions.attributes = fields.split(", ");
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(", ");
    queryOptions.order = [[sortBy, "ASC"]];
  } else {
    queryOptions.order = [["createdAt", "DESC"]];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  queryOptions.limit = limit;
  queryOptions.offset = offset;

  // Count total records
  const total = await Order.count();
  const totalPages = total / limit;

  // Fetch the results
  const results = await Order.findAll(queryOptions);

  // Pagination
  const pagination = {};
  if (offset + limit < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (offset > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    total_pages: totalPages,
    count: results.length,
    pagination,
    data: results,
  });

  next();
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
