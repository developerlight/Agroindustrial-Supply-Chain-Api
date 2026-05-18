const Shipment = require('../models/Shipment');

/**
 * Ambil semua shipment
 */
const getAllShipments = async () => {
  return await Shipment.find()
    .populate('orderId', 'productId quantity deliveryDate status')
    .populate('distributorId', 'name contact')
    .select('-__v');
};

/**
 * Ambil shipment berdasarkan ID
 * @param {string} id
 */
const getShipmentById = async (id) => {
  return await Shipment.findById(id)
    .populate('orderId', 'productId quantity deliveryDate status')
    .populate('distributorId', 'name contact')
    .select('-__v');
};

/**
 * Buat shipment baru
 * @param {Object} data
 */
const createShipment = async (data) => {
  return await Shipment.create(data);
};

/**
 * Update shipment berdasarkan ID
 * @param {string} id
 * @param {Object} data
 */
const updateShipment = async (id, data) => {
  const options = { new: true, runValidators: true };
  return await Shipment.findByIdAndUpdate(id, data, options)
    .populate('orderId', 'productId quantity deliveryDate status')
    .populate('distributorId', 'name contact');
};

/**
 * Hapus shipment berdasarkan ID
 * @param {string} id
 */
const deleteShipment = async (id) => {
  return await Shipment.findByIdAndDelete(id)
    .populate('orderId', 'productId quantity deliveryDate status')
    .populate('distributorId', 'name contact');
};

module.exports = {
  getAllShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment,
};