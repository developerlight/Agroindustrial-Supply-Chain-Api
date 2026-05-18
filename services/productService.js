const Product = require('../models/Product');

/**
 * Ambil semua produk
 */
const getAllProducts = async () => {
  // Bisa ditambahkan filter, pagination, sorting
  return await Product.find().populate('farmerId', 'name farmName contact'); // populate petani
};

/**
 * Ambil produk berdasarkan ID
 * @param {string} id
 */
const getProductById = async (id) => {
  return await Product.findById(id)
    .populate('farmerId', 'name farmName contact') // populate info petani
    .select('-__v');
};

/**
 * Buat produk baru
 * @param {Object} data
 */
const createProduct = async (data) => {
  return await Product.create(data);
};

/**
 * Update produk berdasarkan ID
 * @param {string} id
 * @param {Object} data
 */
const updateProduct = async (id, data) => {
  const options = { new: true, runValidators: true };
  return await Product.findByIdAndUpdate(id, data, options).populate('farmerId', 'name farmName contact');
};

/**
 * Hapus produk berdasarkan ID
 * @param {string} id
 */
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id).populate('farmerId', 'name farmName contact');
};

module.exports = {
  getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};