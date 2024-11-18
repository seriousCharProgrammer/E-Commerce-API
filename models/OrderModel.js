const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../DB");

const Order = db.define(
  "Order",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    status: {
      type: DataTypes.ENUM(["pending", "completed", "cancelled"]),
      defaultValue: "pending",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  { tableName: "Order", timestamps: true }
);

module.exports = Order;
