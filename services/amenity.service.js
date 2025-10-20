const Amenity = require('../models/Amenity');
const Property = require('../models/Property');

class AmenityService {
  async createAmenity(data) {
    const existing = await Amenity.findOne({ slug: new RegExp(`^${data.slug}$`, 'i') });
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
    
    const prop = await Amenity.findById(id);
      if (!prop) throw { status: 404, message: 'Amenity not found' };
      prop.isActive = isActive;
      await prop.save();
      return prop;
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
    const topAmenities = await Property.aggregate([
      {
        $unwind: "$amenities"
      },
      {
        $group: {
          _id: { $toLower: "$amenities" }, // normalize case
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "amenities",
          let: { amenityName: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toLower: "$name" }, "$$amenityName"] }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                icon: 1,
                slug: 1
              }
            }
          ],
          as: "amenity"
        }
      },
      { $unwind: { path: "$amenity", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          name: { $ifNull: ["$amenity.name", "$_id"] },
          icon: "$amenity.icon",
          slug: "$amenity.slug",
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    return topAmenities;
  }
}

module.exports = new AmenityService();
