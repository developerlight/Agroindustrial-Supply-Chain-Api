const APIResponse = require('../utils/apiResponse');
const orderService = require('../services/orderService');
const logger = require('../utils/logger');

/**
 * GET /api/orders
 */
const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    logger.info('Fetched %d orders', orders.length);
    return APIResponse.success(res, orders, 'Orders fetched successfully');
  } catch (error) {
    logger.error('Error fetching orders: %s', error.message);
    next(error);
  }
};

/**
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderService.getOrderById(id);

    if (!order) {
      return APIResponse.notFound(res, 'Order not found');
    }

    logger.info('Fetched order %s', id);
    return APIResponse.success(res, order, 'Order fetched successfully');
  } catch (error) {
    logger.error('Error fetching order %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, deliveryDate } = req.body;

    // Attach buyerId dari JWT (distributor)
    const buyerId = req.user.id;

    const orderData = {
      productId,
      quantity,
      deliveryDate,
      buyerId,
      status: 'pending',
    };

    const newOrder = await orderService.createOrder(orderData);

    logger.info('Created new order %s', newOrder._id);
    return APIResponse.success(res, newOrder, 'Order created successfully', 201);
  } catch (error) {
    logger.error('Error creating order: %s', error.message);
    next(error);
  }
};

/**
 * PUT /api/orders/:id
 */
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Distributor bisa update hanya status order? Bisa di-check di controller jika perlu
    if (req.user.role === 'distributor') {
      // Optional: batasi hanya update status
      if (updateData.status) {
        updateData.status = updateData.status;
      } else {
        return APIResponse.unauthorized(res, 'Distributor can only update status');
      }
    }

    const updatedOrder = await orderService.updateOrder(id, updateData);

    if (!updatedOrder) {
      return APIResponse.notFound(res, 'Order not found');
    }

    logger.info('Updated order %s', id);
    return APIResponse.success(res, updatedOrder, 'Order updated successfully');
  } catch (error) {
    logger.error('Error updating order %s: %s', req.params.id, error.message);
    next(error);
  }
};

/**
 * DELETE /api/orders/:id
 */
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedOrder = await orderService.deleteOrder(id);

    if (!deletedOrder) {
      return APIResponse.notFound(res, 'Order not found');
    }

    logger.info('Deleted order %s', id);
    return APIResponse.success(res, deletedOrder, 'Order deleted successfully');
  } catch (error) {
    logger.error('Error deleting order %s: %s', req.params.id, error.message);
    next(error);
  }
};

module.exports = {
  getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};