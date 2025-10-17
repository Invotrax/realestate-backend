const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  address: {
    line1: String,
    line2: String,
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'cities' },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'states' },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    postalCode: String
  },
  images: [{ type: String }], // store image URLs
  propertyType: { type: String, enum: ['apartment', 'house', 'plot', 'commercial', 'other'], default: 'other' },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  areaSqFt: { type: Number, default: 0 },
  amenities: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema);
