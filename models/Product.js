const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, default: 'kg' },
    pricePerUnit: { type: Number, required: true },
    quantityAvailable: { type: Number, default: 0 },
    harvestDate: { type: Date },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);