const express = require("express");
const Product = require("../models/productModel");
const {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/ProductController");
const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .get(getOneProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
