const mongoose = require('mongoose');

const DistributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['Distributor', 'Retailer'], default: 'Distributor' },
    location: {
      address: { type: String },
      city: { type: String },
      province: { type: String },
      country: { type: String },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer','distributor','admin'], default: 'farmer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Distributor', DistributorSchema);