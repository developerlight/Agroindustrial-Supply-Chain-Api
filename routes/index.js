const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const farmerRoutes = require('./farmerRoutes');
const productRoutes = require('./productRoutes');
const distributorRoutes = require('./distributorRoutes');
const orderRoutes = require('./orderRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const analyticsRoutes = require('./analyticsRoutes');

router.use('/auth', authRoutes);
router.use('/farmers', farmerRoutes);
router.use('/products', productRoutes);
router.use('/distributors', distributorRoutes);
router.use('/orders', orderRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;