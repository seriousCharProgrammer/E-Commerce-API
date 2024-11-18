const { Sequelize, DataTypes, DATE } = require("sequelize");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { db } = require("../DB");
dotenv.config({ path: "./config/config.env" });
const User = db.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "please enter a valid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 4,
          msg: "please enter a password with at least 4 characters",
        },
        max: {
          args: 100,
          msg: "max passowrd is 100 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM(["admin", "seller", "buyer"]),
      defaultValue: "buyer",
    },
  },
  { timestamps: true, tableName: "User" }
);

User.prototype.getSignedJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SEC, {
    expiresIn: process.env.JWT_EXP,
  });
};
User.prototype.matchPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// Before creating a new user (when saving the password for the first time)
User.beforeCreate(async (user, options) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    user.password = await bcrypt.hash(user.password, salt); // Hash the password
  }
});

// Before updating an existing user (e.g., updating password)
User.beforeUpdate(async function (user) {
  if (user.password) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    user.password = await bcrypt.hash(user.password, salt); // Hash the password
  }
});

module.exports = User;
