const { where } = require("sequelize");
const Cart = require("../models/CartModel");
const asyncHandler = require("express-async-handler");

exports.getCartItems = asyncHandler(async (req, res, next) => {
  const items = await Cart.findAll({ where: { user_id: req.user.id } });

  res.status(200).json({
    success: true,
    data: items,
  });
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
