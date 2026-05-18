const Order = require('../models/Order');
const Product = require('../models/Product');
const Shipment = require('../models/Shipment');

/**
 * Ambil data analytics sales
 */
const getSalesAnalytics = async () => {
  // Total penjualan (jumlah order)
  const totalOrders = await Order.countDocuments();

  // Total revenue
  const orders = await Order.find().populate('productId', 'pricePerUnit');
  const totalRevenue = orders.reduce((acc, o) => acc + o.quantity * (o.productId.pricePerUnit || 0), 0);

  // Revenue per product
  const revenuePerProduct = await Order.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.name',
        totalRevenue: { $sum: { $multiply: ['$quantity', '$product.pricePerUnit'] } },
        totalQuantity: { $sum: '$quantity' },
      },
    },
  ]);

  // Orders per status
  const ordersPerStatus = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalOrders,
    totalRevenue,
    revenuePerProduct,
    ordersPerStatus,
  };
};

/**
 * Ambil data analytics stok produk
 */
const getStockAnalytics = async () => {
  // Total stok
  const totalStock = await Product.aggregate([
    { $group: { _id: null, totalQuantity: { $sum: '$quantityAvailable' } } },
  ]);

  // Stok per produk
  const stockPerProduct = await Product.aggregate([
    {
      $group: {
        _id: '$name',
        quantityAvailable: { $sum: '$quantityAvailable' },
      },
    },
  ]);

  // Stok per farmer
  const stockPerFarmer = await Product.aggregate([
    {
      $group: {
        _id: '$farmerId',
        totalQuantity: { $sum: '$quantityAvailable' },
      },
    },
  ]);

  return {
    totalStock: totalStock[0]?.totalQuantity || 0,
    stockPerProduct,
    stockPerFarmer,
  };
};

/**
 * Ambil analytics delivery time
 */
const getDeliveryTimeAnalytics = async () => {
  // Gabungkan orders dan shipments
  const shipments = await Shipment.find()
    .populate('orderId', 'createdAt')
    .populate('distributorId', 'name')
    .select('shipmentDate orderId distributorId');

  const deliveryTimes = shipments.map(s => {
    const createdAt = s.orderId?.createdAt;
    const shippedAt = s.shipmentDate;
    if (!createdAt || !shippedAt) return null;
    const diffMs = new Date(shippedAt) - new Date(createdAt);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return { distributorId: s.distributorId?._id, diffDays };
  }).filter(Boolean);

  const totalShipments = deliveryTimes.length;
  const avgDeliveryTime = totalShipments > 0
    ? deliveryTimes.reduce((acc, d) => acc + d.diffDays, 0) / totalShipments
    : 0;

  // Avg per distributor
  const avgPerDistributorMap = {};
  deliveryTimes.forEach(d => {
    if (!avgPerDistributorMap[d.distributorId]) avgPerDistributorMap[d.distributorId] = [];
    avgPerDistributorMap[d.distributorId].push(d.diffDays);
  });

  const avgPerDistributor = Object.keys(avgPerDistributorMap).map(distributorId => {
    const times = avgPerDistributorMap[distributorId];
    const avg = times.reduce((a,b) => a+b, 0) / times.length;
    return { distributorId, avgDeliveryTimeDays: avg };
  });

  return {
    totalShipments,
    avgDeliveryTimeDays: avgDeliveryTime,
    avgPerDistributor,
  };
};

module.exports = {
  getSalesAnalytics,
  getStockAnalytics,
  getDeliveryTimeAnalytics,
};