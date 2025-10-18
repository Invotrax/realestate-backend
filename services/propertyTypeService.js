const PropertyType = require('../models/PropertyType');

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
  return await PropertyType.find({ isDeleted: false, isActive: true, isFeatured:true }).select('name _id').sort({ name: 1 });
};
