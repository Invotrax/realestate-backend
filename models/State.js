const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  country: { type: Number, required: true },
  name: { type: String, required: true },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'countries', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('states', stateSchema);
