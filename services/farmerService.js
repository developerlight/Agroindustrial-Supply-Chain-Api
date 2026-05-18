const Farmer = require('../models/Farmer');

/**
 * Ambil semua farmer dari database
 */
const getAllFarmers = async () => {
  // Bisa ditambahkan filter, pagination, sorting jika perlu
  return await Farmer.find().select('-password'); // jangan kirim password
};

/**
 * Ambil farmer berdasarkan ID
 * @param {string} id
 */
const getFarmerById = async (id) => {
  return await Farmer.findById(id).select('-password').populate('products'); // populate jika ingin detail produk
};

/**
 * Buat farmer baru
 * @param {Object} data
 */
const createFarmer = async (data) => {
  // data sudah valid dari controller
  return await Farmer.create(data);
};

/**
 * Update farmer berdasarkan ID
 * @param {string} id
 * @param {Object} data
 */
const updateFarmer = async (id, data) => {
  const options = { new: true, runValidators: true };
  return await Farmer.findByIdAndUpdate(id, data, options).select('-password');
};

/**
 * Hapus farmer berdasarkan ID
 * @param {string} id
 */
const deleteFarmer = async (id) => {
  return await Farmer.findByIdAndDelete(id).select('-password');
};

module.exports = {
  getAllFarmers,
  getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer,
};