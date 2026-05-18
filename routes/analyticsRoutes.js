const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

// GET /api/analytics/sales → analytics sales
// Hanya admin yang bisa akses
router.get(
  '/sales',
  authMiddleware,
  authorizeRoles('admin'),
  analyticsController.getSalesAnalytics
);

// GET /api/analytics/stock → analytics stock
router.get(
  '/stock',
  authMiddleware,
  authorizeRoles('admin'),
  analyticsController.getStockAnalytics
);

// GET /api/analytics/delivery-time
router.get(
  '/delivery-time',
  authMiddleware,
  authorizeRoles('admin'),
  analyticsController.getDeliveryTimeAnalytics
);

module.exports = router;