const { Sequelize, DataTypes, DATE } = require("sequelize");

const { db } = require("../DB");

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

module.exports = User;
