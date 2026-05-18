const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributorController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { validate, validateDistributor, validateObjectIdParam } = require('../middlewares/validateMiddleware');

// GET /api/distributors → list semua distributor
router.get('/', authMiddleware, authorizeRoles('admin'), distributorController.getDistributors);

// GET /api/distributors/:id → detail distributor
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  validate(validateObjectIdParam('id')),
  distributorController.getDistributorById
);

// POST /api/distributors → create new distributor (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  validate(validateDistributor),
  distributorController.createDistributor
);

// PUT /api/distributors/:id → update distributor (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  validate(validateObjectIdParam('id')),
  validate(validateDistributor),
  distributorController.updateDistributor
);

// DELETE /api/distributors/:id → delete distributor (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  validate(validateObjectIdParam('id')),
  distributorController.deleteDistributor
);

module.exports = router;