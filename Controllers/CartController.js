const Cart = require("../models/CartModel");
const asyncHandler = require("express-async-handler");

exports.getCartItems = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const items = await Cart.findAll({ where: { id: userId } });

  res.status(200).json({
    success: true,
    data: items,
  });
});
