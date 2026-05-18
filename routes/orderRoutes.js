const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { validate, validateObjectIdParam, validateOrder } = require('../middlewares/validateMiddleware');

// GET /api/orders → list semua order
// Hanya admin atau distributor yang bisa akses semua order
router.get('/', authMiddleware, authorizeRoles('admin', 'distributor'), orderController.getOrders);

// GET /api/orders/:id → detail order
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateObjectIdParam('id')),
  orderController.getOrderById
);

// POST /api/orders → create new order (distributor only)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('distributor'),
  validate(validateOrder),
  orderController.createOrder
);

// PUT /api/orders/:id → update order
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateObjectIdParam('id')),
  orderController.updateOrder
);

// DELETE /api/orders/:id → delete order (admin or distributor)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateObjectIdParam('id')),
  orderController.deleteOrder
);

module.exports = router;