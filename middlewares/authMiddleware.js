const jwt = require('jsonwebtoken');
const APIResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const Farmer = require('../models/Farmer');
const Distributor = require('../models/Distributor');

// Middleware untuk verify JWT
const authMiddleware = async (req, res, next) => {
  let token;

  // Token biasanya dikirim di header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return APIResponse.unauthorized(res, 'No token provided');
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info ke request
    req.user = decoded; // decoded biasanya { id, role }

    next();
  } catch (error) {
    logger.error('JWT error: %s', error.message);
    return APIResponse.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Middleware role-based access
 * @param  {...any} roles - list role yang boleh akses
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return APIResponse.forbidden(res, 'You do not have access to this resource');
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };