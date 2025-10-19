const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  country: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);
