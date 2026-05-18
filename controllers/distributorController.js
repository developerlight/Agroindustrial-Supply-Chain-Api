const APIResponse = require('../utils/apiResponse');
const distributorService = require('../services/distributorService');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * GET /api/distributors
 */
const getDistributors = async (req, res, next) => {
  try {
    const distributors = await distributorService.getAllDistributors();
    logger.info('Fetched %d distributors', distributors.length);
    return APIResponse.success(res, distributors, 'Distributors fetched successfully');
  } catch (error) {
    logger.error('Error fetching distributors: %s', error.message);
    next(error);
  }
};

/**
 * GET /api/distributors/:id
 */
const getDistributorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const distributor = await distributorService.getDistributorById(id);

    if (!distributor) {
      return APIResponse.notFound(res, 'Distributor not found');
    }

    logger.info('Fetched distributor %s', id);
    return APIResponse.success(res, distributor, 'Distributor fetched successfully');
  } catch (error) {
    logger.error('Error fetching distributor %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * POST /api/distributors
 */
const createDistributor = async (req, res, next) => {
  try {
    const { name, type, contact, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const distributorData = {
      name,
      type: type || 'Distributor',
      contact,
      password: hashedPassword,
      role: 'distributor',
    };

    const newDistributor = await distributorService.createDistributor(distributorData);

    logger.info('Created new distributor %s', newDistributor._id);
    return APIResponse.success(res, newDistributor, 'Distributor created successfully', 201);
  } catch (error) {
    logger.error('Error creating distributor: %s', error.message);
    next(error);
  }
};

/**
 * PUT /api/distributors/:id
 */
const updateDistributor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, contact, password } = req.body;

    const updateData = { name, type, contact };

    // Jika password diupdate, hash dulu
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedDistributor = await distributorService.updateDistributor(id, updateData);

    if (!updatedDistributor) {
      return APIResponse.notFound(res, 'Distributor not found');
    }

    logger.info('Updated distributor %s', id);
    return APIResponse.success(res, updatedDistributor, 'Distributor updated successfully');
  } catch (error) {
    logger.error('Error updating distributor %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * DELETE /api/distributors/:id
 */
const deleteDistributor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedDistributor = await distributorService.deleteDistributor(id);

    if (!deletedDistributor) {
      return APIResponse.notFound(res, 'Distributor not found');
    }

    logger.info('Deleted distributor %s', id);
    return APIResponse.success(res, deletedDistributor, 'Distributor deleted successfully');
  } catch (error) {
    logger.error('Error deleting distributor %s: %s', req.params.id, error.message);
    next(error);
  }
};

module.exports = {
  getDistributors,
    getDistributorById,
    createDistributor,
    updateDistributor,
    deleteDistributor,
};