const APIResponse = require('../utils/apiResponse');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

/**
 * GET /api/analytics/sales
 */
const getSalesAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getSalesAnalytics();
    logger.info('Fetched sales analytics');
    return APIResponse.success(res, analytics, 'Sales analytics fetched successfully');
  } catch (error) {
    logger.error('Error fetching sales analytics: %s', error.message);
    next(error);
  }
};

/**
 * GET /api/analytics/stock
 */
const getStockAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getStockAnalytics();
    logger.info('Fetched stock analytics');
    return APIResponse.success(res, analytics, 'Stock analytics fetched successfully');
  } catch (error) {
    logger.error('Error fetching stock analytics: %s', error.message);
    next(error);
  }
};

/**
 * GET /api/analytics/delivery-time
 */
const getDeliveryTimeAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getDeliveryTimeAnalytics();
    logger.info('Fetched delivery time analytics');
    return APIResponse.success(res, analytics, 'Delivery time analytics fetched successfully');
  } catch (error) {
    logger.error('Error fetching delivery time analytics: %s', error.message);
    next(error);
  }
};

module.exports = {
  getSalesAnalytics,
    getStockAnalytics,
    getDeliveryTimeAnalytics,
};