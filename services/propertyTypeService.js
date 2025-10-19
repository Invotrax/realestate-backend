const PropertyType = require('../models/PropertyType');
const Property = require('../models/Property');
// ✅ Create Property Type (Admin)
exports.createPropertyType = async (data) => {
  const existing = await PropertyType.findOne({ name: data.name, isDeleted: false });
  if (existing) throw { status: 400, message: 'Property type already exists' };

  const newType = new PropertyType(data);
  return await newType.save();
};

// ✅ Get All (Admin)
exports.getAllPropertyTypesAdmin = async () => {
  return await PropertyType.find({ isDeleted: false }).sort({ createdAt: -1 });
};




exports.toggleStatus = async (id,key, isActive) => {
 const prop = await PropertyType.findByIdAndUpdate(
    id,
    { $set: { [key]: isActive } }, // Dynamically sets or adds the key
    { new: true, runValidators: true } // returns updated doc
  );

  if (!prop) throw { status: 404, message: 'Property not found' };
  return prop;
};

// ✅ Mark as Deleted
exports.markAsDeleted = async (id) => {
  const deleted = await PropertyType.findByIdAndUpdate(id, { isDeleted: true, updatedAt: Date.now() }, { new: true });
  if (!deleted) throw { status: 404, message: 'Property type not found' };
  return deleted;
};

// ✅ Public Listing (General)
exports.getAllActivePropertyTypes = async () => {
  return await PropertyType.find({ isDeleted: false, isActive: true }).sort({ name: 1 });
};

// ✅ Public Listing (General)
exports.getFeaturedPropertyType = async () => {
  return await Property.aggregate([
      // Step 1: Filter active properties
      {
        $match: {
          isActive: true,
          isDeleted: false
        }
      },

      // Step 2: Lookup property type details
      {
        $lookup: {
          from: 'propertytypes', // collection name (lowercase plural)
          localField: 'propertyType',
          foreignField: '_id',
          as: 'propertyType'
        }
      },
      { $unwind: '$propertyType' },

      // Step 3: Only include featured property types
      {
        $match: {
          'propertyType.isFeatured': true
        }
      },

      // Step 4: Lookup country, state, and city details
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $lookup: {
          from: 'states',
          localField: 'state',
          foreignField: '_id',
          as: 'state'
        }
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'city'
        }
      },

      // Step 5: Unwind each location array (optional but cleaner)
      { $unwind: { path: '$country', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$state', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },

      // Step 6: Group properties by propertyType
      {
        $group: {
          _id: '$propertyType._id',
          typeName: { $first: '$propertyType.name' },
          typeIcon: { $first: '$propertyType.icon' },
          totalProperties: { $sum: 1 },
          properties: { $push: '$$ROOT' }
        }
      },

      // Step 7: Limit properties per group
      {
        $project: {
          _id: 1,
          typeName: 1,
          typeIcon: 1,
          totalProperties: 1,
          properties: { $slice: ['$properties', 6] }
        }
      },

      // Step 8: Sort
      { $sort: { typeName: 1 } }
    ]);
};
