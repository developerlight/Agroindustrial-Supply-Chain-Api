const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    farmName: { type: String, required: true },
    location: {
      address: { type: String },
      city: { type: String },
      province: { type: String },
      country: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer','distributor','admin'], default: 'farmer' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', FarmerSchema);