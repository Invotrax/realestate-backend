const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  phonecode: { type: String, required: true },
  currency_symbol: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('countries', countrySchema);
