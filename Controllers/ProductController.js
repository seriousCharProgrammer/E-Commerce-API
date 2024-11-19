const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  //const products = await Product.findAll();

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
  const total = await Product.count();
  const totalPages = total / limit;

  // Fetch the results
  const results = await Product.findAll(queryOptions);

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

exports.getOneProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return next(new ErrorResponse("product dosent exist", 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findByPk(req.params.id);
  if (!product) {
    return next(new ErrorResponse("product dosent exist", 404));
  }
  await Product.update(req.body, { where: { id: req.params.id } });
  product = await Product.findByPk(req.params.id);
  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findByPk(req.params.id);
  if (!product) {
    return next(new ErrorResponse("product dosent exist", 404));
  }
  product = await Product.destroy();
  res.status(200).json({
    success: true,
    data: null,
  });
});
