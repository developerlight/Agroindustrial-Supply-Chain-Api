const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered'],
      default: 'pending',
    },
    pickupDate: { type: Date },
    deliveryDate: { type: Date },
    vehicleInfo: {
      vehicleType: { type: String },
      plateNumber: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', ShipmentSchema);