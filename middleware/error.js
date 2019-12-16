const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  let error = {
    ...err
  };
  error.message = err.message;

  console.log("ERROR - " + err.message);

  // Mongoode bad objectid
  if (err.name === "CastError") {
    const message = `Resource not found with ID ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
  next();
};

module.exports = errorHandler;
