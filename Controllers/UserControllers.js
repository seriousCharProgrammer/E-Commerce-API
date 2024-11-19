const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  let queryOptions = {};
  queryOptions.attributes = { exclude: ["password"] };

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
    if (fields.includes("password")) {
      return next(new ErrorResponse("password field cannot be selected", 404));
    }
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
  const total = await User.count();
  const totalPages = total / limit;

  // Fetch the results
  const results = await User.findAll(queryOptions);

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

exports.getOneUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new ErrorResponse("user doesint exist", 404));
  }

  await User.update(req.body, { where: { id: req.params.id } });
  await user.save();

  user = await User.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new ErrorResponse("user doesint exist", 404));
  }

  await User.update(req.body, { where: { id: req.params.id } });

  user = await User.destroy({ where: { id: req.params.id } });

  res.status(200).json({
    success: true,
    data: null,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});
