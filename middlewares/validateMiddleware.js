const { body, param, validationResult } = require('express-validator');
const APIResponse = require('../utils/apiResponse');

/**
 * Middleware generic untuk menjalankan validasi
 * @param {Array} validations - array validator dari express-validator
 */
const validate = validations => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Kembalikan response validasi
  return APIResponse.error(
    res,
    'Validation Error',
    422,
    errors.array().map(err => ({ field: err.param, message: err.msg }))
  );
};

/**
 * Validator untuk ObjectId param
 */
const validateObjectIdParam = (paramName = 'id') => {
  return [
    param(paramName)
      .isMongoId()
      .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
  ];
};

/**
 * Validator Product
 */
const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('unit').optional().isString().withMessage('Unit must be string'),
  body('pricePerUnit')
    .notEmpty()
    .withMessage('Price per unit is required')
    .isNumeric()
    .withMessage('Price per unit must be a number'),
  body('quantityAvailable')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer >= 0'),
  body('harvestDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Harvest date must be a valid date')
];

/**
 * Validator Farmer
 */
const validateFarmer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('farmName').notEmpty().withMessage('Farm name is required'),
  body('location.address').optional().isString(),
  body('location.city').optional().isString(),
  body('location.province').optional().isString(),
  body('location.country').optional().isString(),
  body('contact.phone').optional().isMobilePhone(),
  body('contact.email').optional().isEmail(),
];

/**
 * Validator Distributor
 */
const validateDistributor = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').optional().isIn(['Distributor', 'Retailer']).withMessage('Type must be Distributor or Retailer'),
  body('location.address').optional().isString(),
  body('location.city').optional().isString(),
  body('location.province').optional().isString(),
  body('location.country').optional().isString(),
  body('contact.phone').optional().isMobilePhone(),
  body('contact.email').optional().isEmail(),
];

/**
 * Validator Order
 */
const validateOrder = [
  body('productId').notEmpty().withMessage('Product ID is required').isMongoId(),
  body('buyerId').notEmpty().withMessage('Buyer ID is required').isMongoId(),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer >= 1'),
  body('deliveryDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Delivery date must be a valid date'),
];

/**
 * Validator Shipment
 */
const validateShipment = [
  body('orderId').notEmpty().withMessage('Order ID is required').isMongoId(),
  body('distributorId').notEmpty().withMessage('Distributor ID is required').isMongoId(),
  body('status')
    .optional()
    .isIn(['pending', 'in_transit', 'delivered'])
    .withMessage('Status must be pending, in_transit, or delivered'),
  body('pickupDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Pickup date must be a valid date'),
  body('deliveryDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Delivery date must be a valid date'),
  body('vehicleInfo.vehicleType').optional().isString(),
  body('vehicleInfo.plateNumber').optional().isString(),
];

module.exports = {
  validate,
  validateObjectIdParam,
  validateProduct,
  validateFarmer,
  validateDistributor,
  validateOrder,
  validateShipment,
};