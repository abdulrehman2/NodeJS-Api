const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} value: ${err.value} `;
  return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate ${err.keyValue.name} `;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(', ');
  return new AppError(message, 400);
};
const handleDevError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleProductionError = (res, err) => {
  //expected errors
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
  } else {
    //unexpected errors
    console.log(err);
    res.status(500).json({ status: err.status, message: 'Something went really wrong' });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    handleDevError(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    } else if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }
    handleProductionError(res, error);
  }
};
