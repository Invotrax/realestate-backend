const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  propertyType: { type: String, default: 'other' },
  propertyStatus: { type: String, enum: ['sale', 'rent'], default: 'rent' },

  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },

  images: [{ type: String }], // store image URLs
  
  yearOfBuilt: { type: Number, default: 0 },
  garage: { type: Number, default: 0 },
  garageArea: { type: Number, default: 0 },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  areaSqFt: { type: Number, default: 0 },
  amenities: [{ type: String }],
  
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  line1: String,
  line2: String,
  postalCode: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isTop: { type: Boolean, default: false },
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
