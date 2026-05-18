const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// POST /api/auth/register
router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['farmer', 'distributor', 'admin'])
      .withMessage('Role must be farmer, distributor, or admin'),
  ]),
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['farmer', 'distributor', 'admin'])
      .withMessage('Role must be farmer, distributor, or admin'),
  ]),
  authController.login
);

// Endpoint /api/auth/me
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;