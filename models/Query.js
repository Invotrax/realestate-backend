const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', querySchema);
