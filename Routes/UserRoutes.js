const express = require("express");
const User = require("../models/UserModel");
const { signUp, login } = require("../Controllers/authController");
const {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../Controllers/UserControllers");
const { protect, authorize } = require("../Middlewares/authentication");
const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), getAllUsers)
  .post(protect, authorize("admin"), createUser);
router
  .route("/:id")
  .get(protect, authorize("admin"), getOneUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;
