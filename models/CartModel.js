const { Sequelize, DataTypes, DATE } = require("sequelize");
const { db } = require("../DB");

const Cart = db.define(
  "Cart",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Product",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { timestamps: true, tableName: "Cart" }
);

module.exports = Cart;
