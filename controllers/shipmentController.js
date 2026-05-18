const APIResponse = require('../utils/apiResponse');
const shipmentService = require('../services/shipmentService');
const logger = require('../utils/logger');

/**
 * GET /api/shipments
 */
const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getAllShipments();
    logger.info('Fetched %d shipments', shipments.length);
    return APIResponse.success(res, shipments, 'Shipments fetched successfully');
  } catch (error) {
    logger.error('Error fetching shipments: %s', error.message);
    next(error);
  }
};

/**
 * GET /api/shipments/:id
 */
const getShipmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shipment = await shipmentService.getShipmentById(id);

    if (!shipment) {
      return APIResponse.notFound(res, 'Shipment not found');
    }

    logger.info('Fetched shipment %s', id);
    return APIResponse.success(res, shipment, 'Shipment fetched successfully');
  } catch (error) {
    logger.error('Error fetching shipment %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * POST /api/shipments
 */
const createShipment = async (req, res, next) => {
  try {
    const { orderId, shipmentDate, status } = req.body;

    // Attach distributorId dari JWT jika role distributor
    let distributorId = null;
    if (req.user.role === 'distributor') {
      distributorId = req.user.id;
    } else if (req.body.distributorId) {
      distributorId = req.body.distributorId; // admin bisa set distributorId
    }

    const shipmentData = {
      orderId,
      shipmentDate,
      status: status || 'pending',
      distributorId,
    };

    const newShipment = await shipmentService.createShipment(shipmentData);

    logger.info('Created new shipment %s', newShipment._id);
    return APIResponse.success(res, newShipment, 'Shipment created successfully', 201);
  } catch (error) {
    logger.error('Error creating shipment: %s', error.message);
    next(error);
  }
};

/**
 * PUT /api/shipments/:id
 */
const updateShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Distributor hanya bisa update status
    if (req.user.role === 'distributor') {
      if (updateData.status) {
        updateData.status = updateData.status;
      } else {
        return APIResponse.unauthorized(res, 'Distributor can only update status');
      }
    }

    const updatedShipment = await shipmentService.updateShipment(id, updateData);

    if (!updatedShipment) {
      return APIResponse.notFound(res, 'Shipment not found');
    }

    logger.info('Updated shipment %s', id);
    return APIResponse.success(res, updatedShipment, 'Shipment updated successfully');
  } catch (error) {
    logger.error('Error updating shipment %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * DELETE /api/shipments/:id
 */
const deleteShipment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedShipment = await shipmentService.deleteShipment(id);

    if (!deletedShipment) {
      return APIResponse.notFound(res, 'Shipment not found');
    }

    logger.info('Deleted shipment %s', id);
    return APIResponse.success(res, deletedShipment, 'Shipment deleted successfully');
  } catch (error) {
    logger.error('Error deleting shipment %s: %s', req.params.id, error.message);
    next(error);
  }
};


module.exports = {
  getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment,
};