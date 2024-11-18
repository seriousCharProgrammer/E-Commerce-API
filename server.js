const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./Middlewares/error");
const morgan = require("morgan");
const authRouter = require("./Routes/authRoute");
const productRouter = require("./Routes/productRoute");
const { connect, db } = require("./DB");
const app = express();
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));

connect();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err}`);
  server.close(() => {
    process.exit(1);
  });
});
