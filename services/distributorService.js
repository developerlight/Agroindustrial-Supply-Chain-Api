const Distributor = require('../models/Distributor');

/**
 * Ambil semua distributor
 */
const getAllDistributors = async () => {
  return await Distributor.find().select('-password'); // jangan kirim password
};

/**
 * Ambil distributor berdasarkan ID
 * @param {string} id
 */
const getDistributorById = async (id) => {
  return await Distributor.findById(id).select('-password').populate('orders'); // populate orders jika perlu
};

/**
 * Buat distributor baru
 * @param {Object} data
 */
const createDistributor = async (data) => {
  return await Distributor.create(data);
};

/**
 * Update distributor berdasarkan ID
 * @param {string} id
 * @param {Object} data
 */
const updateDistributor = async (id, data) => {
  const options = { new: true, runValidators: true };
  return await Distributor.findByIdAndUpdate(id, data, options).select('-password');
};

/**
 * Hapus distributor berdasarkan ID
 * @param {string} id
 */
const deleteDistributor = async (id) => {
  return await Distributor.findByIdAndDelete(id).select('-password');
};

module.exports = {
  getAllDistributors,
    getDistributorById,
    createDistributor,
    updateDistributor,
    deleteDistributor,
};