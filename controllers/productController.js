const APIResponse = require('../utils/apiResponse');
const productService = require('../services/productService');
const logger = require('../utils/logger');

/**
 * GET /api/products
 */
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    logger.info('Fetched %d products', products.length);
    return APIResponse.success(res, products, 'Products fetched successfully');
  } catch (error) {
    logger.error('Error fetching products: %s', error.message);
    next(error);
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    if (!product) {
      return APIResponse.notFound(res, 'Product not found');
    }

    logger.info('Fetched product %s', id);
    return APIResponse.success(res, product, 'Product fetched successfully');
  } catch (error) {
    logger.error('Error fetching product %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, category, unit, pricePerUnit, quantityAvailable, harvestDate } = req.body;

    // Attach farmerId dari JWT jika role farmer
    let farmerId = null;
    if (req.user.role === 'farmer') {
      farmerId = req.user.id;
    } else if (req.body.farmerId) {
      farmerId = req.body.farmerId; // admin bisa set farmerId
    }

    const productData = {
      name,
      category,
      unit,
      pricePerUnit,
      quantityAvailable,
      harvestDate,
      farmerId,
    };

    const newProduct = await productService.createProduct(productData);

    logger.info('Created new product %s', newProduct._id);
    return APIResponse.success(res, newProduct, 'Product created successfully', 201);
  } catch (error) {
    logger.error('Error creating product: %s', error.message);
    next(error);
  }
};

/**
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Jika role farmer, pastikan farmerId sesuai JWT
    if (req.user.role === 'farmer') {
      updateData.farmerId = req.user.id;
    }

    const updatedProduct = await productService.updateProduct(id, updateData);

    if (!updatedProduct) {
      return APIResponse.notFound(res, 'Product not found');
    }

    logger.info('Updated product %s', id);
    return APIResponse.success(res, updatedProduct, 'Product updated successfully');
  } catch (error) {
    logger.error('Error updating product %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.deleteProduct(id);

    if (!deletedProduct) {
      return APIResponse.notFound(res, 'Product not found');
    }

    logger.info('Deleted product %s', id);
    return APIResponse.success(res, deletedProduct, 'Product deleted successfully');
  } catch (error) {
    logger.error('Error deleting product %s: %s', req.params.id, error.message);
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};