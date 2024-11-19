const ErrorResponse = require("../utils/ErrorResponse");
const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} = require("sequelize/lib/errors");
const errorHandler = function (err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  if (err instanceof UniqueConstraintError) {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 400);
  }
  if (err instanceof ForeignKeyConstraintError) {
    const message = `Invalid foreign key reference with id ${err.index}.`;
    error = new ErrorResponse(message, 400);
  }
  if (err instanceof ValidationError) {
    const message = Object.values(err.errors).map((el) => el.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "server error",
  });
};
module.exports = errorHandler;
