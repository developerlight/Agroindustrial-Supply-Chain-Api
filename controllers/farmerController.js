const APIResponse = require('../utils/apiResponse');
const farmerService = require('../services/farmerService');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * GET /api/farmers
 */
const getFarmers = async (req, res, next) => {
  try {
    const farmers = await farmerService.getAllFarmers();
    logger.info('Fetched %d farmers', farmers.length);
    return APIResponse.success(res, farmers, 'Farmers fetched successfully');
  } catch (error) {
    logger.error('Error fetching farmers: %s', error.message);
    next(error); // akan ditangani errorMiddleware
  }
};

/**
 * GET /api/farmers/:id
 */
const getFarmerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farmer = await farmerService.getFarmerById(id);

    if (!farmer) {
      return APIResponse.notFound(res, 'Farmer not found');
    }

    logger.info('Fetched farmer %s', id);
    return APIResponse.success(res, farmer, 'Farmer fetched successfully');
  } catch (error) {
    logger.error('Error fetching farmer %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * POST /api/farmers
 */
const createFarmer = async (req, res, next) => {
  try {
    const { name, farmName, contact, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const farmerData = {
      name,
      farmName,
      contact,
      password: hashedPassword,
      role: 'farmer',
    };

    const newFarmer = await farmerService.createFarmer(farmerData);

    logger.info('Created new farmer %s', newFarmer._id);

    return APIResponse.success(res, newFarmer, 'Farmer created successfully', 201);
  } catch (error) {
    logger.error('Error creating farmer: %s', error.message);
    next(error);
  }
};

/**
 * PUT /api/farmers/:id
 */
const updateFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, farmName, contact, password } = req.body;

    const updateData = { name, farmName, contact };

    // Jika ada password baru, hash dulu
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedFarmer = await farmerService.updateFarmer(id, updateData);

    if (!updatedFarmer) {
      return APIResponse.notFound(res, 'Farmer not found');
    }

    logger.info('Updated farmer %s', id);
    return APIResponse.success(res, updatedFarmer, 'Farmer updated successfully');
  } catch (error) {
    logger.error('Error updating farmer %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * DELETE /api/farmers/:id
 */
const deleteFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedFarmer = await farmerService.deleteFarmer(id);

    if (!deletedFarmer) {
      return APIResponse.notFound(res, 'Farmer not found');
    }

    logger.info('Deleted farmer %s', id);
    return APIResponse.success(res, deletedFarmer, 'Farmer deleted successfully');
  } catch (error) {
    logger.error('Error deleting farmer %s: %s', req.params.id, error.message);
    next(error);
  }
};


module.exports = {
  getFarmers,
  getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer,
};