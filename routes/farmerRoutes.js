const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { validate, validateObjectIdParam, validateFarmer } = require('../middlewares/validateMiddleware');

// GET /api/farmers
// Hanya admin yang bisa akses daftar farmer
router.get('/', authMiddleware, authorizeRoles('admin'), farmerController.getFarmers);

// GET /api/farmers/:id → detail
router.get('/:id', 
  authMiddleware, 
  authorizeRoles('admin', 'farmer'), // admin bisa lihat semua, farmer bisa lihat diri sendiri
  validate(validateObjectIdParam('id')), 
  farmerController.getFarmerById
);

// POST /api/farmers → create new farmer (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  validate(validateFarmer), // validasi body
  farmerController.createFarmer
);

// PUT /api/farmers/:id → update farmer
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'farmer'), // admin bisa update semua, farmer bisa update diri sendiri
  validate(validateObjectIdParam('id')),
  validate(validateFarmer),
  farmerController.updateFarmer
);

// DELETE /api/farmers/:id → delete farmer (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  validate(validateObjectIdParam('id')),
  farmerController.deleteFarmer
);

module.exports = router;