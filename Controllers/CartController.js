const { where } = require("sequelize");
const Cart = require("../models/CartModel");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
exports.getCartItems = asyncHandler(async (req, res, next) => {
  //const items = await Cart.findAll({ where: { user_id: req.user.id } });

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
    queryOptions.order = [["quantity", "DESC"]];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  queryOptions.limit = limit;
  queryOptions.offset = offset;

  // Count total records
  const total = await Cart.count();
  const totalPages = total / limit;

  // Fetch the results
  const results = await Cart.findAll(queryOptions);

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

exports.addItemCart = asyncHandler(async (req, res, next) => {
  let existingitem = await Cart.findOne({
    where: { user_id: req.user.id, product_id: req.body.product_id },
  });

  if (existingitem) {
    // If the product already exists, update the quantity
    existingitem.quantity += req.body.quantity;
    await existingitem.save();

    return res
      .status(200)
      .json({ message: "Cart updated successfully", cart: existingitem });
  }

  // If the product does not exist, create a new cart entry
  const newCartItem = await Cart.create({
    user_id: req.user.id,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
  });
  res.status(201).json({ message: "Product added to cart", cart: newCartItem });
});

exports.updateCart = asyncHandler(async (req, res, next) => {
  let item = await Cart.findByPk(req.params.id);

  await Cart.update(req.body, { where: { id: req.params.id } });

  item = await Cart.findByPk(req.params.id);

  res.status(201).json({ message: "updated Card quantity", cart: item });
});

exports.deleteCart = asyncHandler(async (req, res, next) => {
  let item = await Cart.findByPk(req.params.id);

  await Cart.destroy({ where: { id: req.params.id } });

  res.status(201).json({ message: "deleted item from cart " });
});
