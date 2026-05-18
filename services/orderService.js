const Order = require('../models/Order');

/**
 * Ambil semua order
 */
const getAllOrders = async () => {
  return await Order.find()
    .populate('productId', 'name category pricePerUnit')
    .populate('buyerId', 'name contact role')
    .select('-__v');
};

/**
 * Ambil order berdasarkan ID
 * @param {string} id
 */
const getOrderById = async (id) => {
  return await Order.findById(id)
    .populate('productId', 'name category pricePerUnit')
    .populate('buyerId', 'name contact role')
    .select('-__v');
};

/**
 * Buat order baru
 * @param {Object} data
 */
const createOrder = async (data) => {
  return await Order.create(data);
};

/**
 * Update order berdasarkan ID
 * @param {string} id
 * @param {Object} data
 */
const updateOrder = async (id, data) => {
  const options = { new: true, runValidators: true };
  return await Order.findByIdAndUpdate(id, data, options)
    .populate('productId', 'name category pricePerUnit')
    .populate('buyerId', 'name contact role');
};

/**
 * Hapus order berdasarkan ID
 * @param {string} id
 */
const deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id)
    .populate('productId', 'name category pricePerUnit')
    .populate('buyerId', 'name contact role');
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
    updateOrder,
    deleteOrder,
};