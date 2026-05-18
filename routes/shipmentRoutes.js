const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { validate, validateObjectIdParam, validateShipment } = require('../middlewares/validateMiddleware');

// GET /api/shipments → list semua shipments
// Hanya admin dan distributor yang bisa akses
router.get('/', authMiddleware, authorizeRoles('admin', 'distributor'), shipmentController.getShipments);

// GET /api/shipments/:id → detail shipment
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateObjectIdParam('id')),
  shipmentController.getShipmentById
);

// POST /api/shipments → create new shipment (admin or distributor)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateShipment),
  shipmentController.createShipment
);

// PUT /api/shipments/:id → update shipment
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateObjectIdParam('id')),
  validate(validateShipment),
  shipmentController.updateShipment
);

// DELETE /api/shipments/:id → delete shipment
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'distributor'),
  validate(validateObjectIdParam('id')),
  shipmentController.deleteShipment
);

module.exports = router;