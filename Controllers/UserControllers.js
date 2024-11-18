const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll();

  res.status(200).json({
    success: true,
    data: users,
  });
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
