const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll();

  res.status(200).json({
    success: true,
    data: products,
  });
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
