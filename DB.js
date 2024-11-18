const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const db = new Sequelize(
  process.env.DATA_URI.replace("<PASSOWRD>", process.env.DATA_PASS)
);
const connect = async () => {
  await db.authenticate();
  console.log("Connection has been established successfully.");
};

module.exports = { db, connect };
