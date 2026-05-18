const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { validate, validateObjectIdParam, validateProduct } = require('../middlewares/validateMiddleware');

// GET /api/products → list semua produk
// Bisa publik, jadi tidak pakai authMiddleware. Jika ingin hanya user login:
router.get('/', productController.getProducts);

// GET /api/products/:id → detail produk
router.get('/:id', validate(validateObjectIdParam('id')), productController.getProductById);

// POST /api/products → create new product (admin or farmer)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'farmer'),
  validate(validateProduct),
  productController.createProduct
);

// PUT /api/products/:id → update product
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'farmer'),
  validate(validateObjectIdParam('id')),
  validate(validateProduct),
  productController.updateProduct
);

// DELETE /api/products/:id → delete product (admin or farmer)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'farmer'),
  validate(validateObjectIdParam('id')),
  productController.deleteProduct
);

module.exports = router;