const APIResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Global error handler
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error lengkap ke console / file
  logger.error('Error: %s', err.stack || err.message);

  // Jika error punya statusCode, gunakan; else default 500
  const statusCode = err.statusCode || 500;

  // Jika error berasal dari validasi mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return APIResponse.error(res, 'Validation Error', 422, errors);
  }

  // Jika error berasal dari cast mongoose (invalid ObjectId)
  if (err.name === 'CastError') {
    return APIResponse.error(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // Default server error
  return APIResponse.serverError(res, err.message || 'Internal Server Error');
};

module.exports = errorMiddleware;