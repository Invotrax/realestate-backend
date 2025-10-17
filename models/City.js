const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  state: { type: Number, required: true },
  state_id: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
