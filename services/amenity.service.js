const Amenity = require('../models/Amenity');

class AmenityService {
  async createAmenity(data) {
    const existing = await Amenity.findOne({ name: new RegExp(`^${data.name}$`, 'i') });
    if (existing) throw new Error('Amenity already exists');

    const amenity = new Amenity(data);
    return await amenity.save();
  }

  async getAdminAmenities() {
    return await Amenity.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  async getAmenityById(id) {
    const amenity = await Amenity.findById(id);
    if (!amenity || amenity.isDeleted) throw new Error('Amenity not found');
    return amenity;
  }

  async updateStatus(id, isActive) {
    const amenity = await Amenity.findByIdAndUpdate(
      id,
      { isActive, updatedAt: Date.now() },
      { new: true }
    );
    if (!amenity) throw new Error('Amenity not found');
    return amenity;
  }

  async softDelete(id) {
    const amenity = await Amenity.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );
    if (!amenity) throw new Error('Amenity not found');
    return amenity;
  }

  async getPublicAmenities() {
    return await Amenity.find({ isDeleted: false, isActive: true }).sort({ name: 1 });
  }
}

module.exports = new AmenityService();
