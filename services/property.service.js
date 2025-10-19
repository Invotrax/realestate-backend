const Property = require('../models/Property');
const State = require('../models/State');

exports.create = async (payload) => {
  const prop = new Property(payload);
  await prop.save();
  return prop;
};

exports.update = async (id, payload) => {
  const prop = await Property.findById(id);
  if (!prop) throw { status: 404, message: 'Property not found' };
  Object.assign(prop, payload);
  await prop.save();
  return prop;
};

exports.listAdmin = async ({ page=1, limit=10, filters={} }) => {
  const skip = (page-1)*limit;
  const query = { ...filters, isDeleted:false }; // admins see all including inactive and deleted if desired; adjust
  const total = await Property.countDocuments(query);
  const items = await Property.find(query)
  .populate('createdBy', 'name email')
  .populate('propertyType')
  .skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit};
};

exports.listPublic = async ({ page=1, limit=10, filters={} } = {}) => {
  const skip = (page-1)*limit;
  const baseQuery = { isActive: true, isDeleted: false, ...filters };
  const total = await Property.countDocuments(baseQuery);
  const items = await Property.find(baseQuery).populate('createdBy', 'name').populate('country state', 'name').skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit};
};
exports.getByCountry = async ({  filters={} } = {}) => {
  const matchCondition = {  isActive:true };
    if (filters.country) {
      matchCondition.country = new mongoose.Types.ObjectId(filters.country);
    }

    // Aggregation pipeline
    const result = await State.aggregate([
    { $match: matchCondition },
    {
      $lookup: {
        from: 'properties',
        localField: '_id',
        foreignField: 'state',
        as: 'properties'
      }
    },

    // Step 3: Add computed property count
    {
      $addFields: {
        propertyCount: { $size: '$properties' }
      }
    },

    // Step 4: Project only required fields
    {
      $project: {
        _id: 1,
        name: 1,
        image: 1, // image from state model
        propertyCount: 1
      }
    },

    // Step 5: Sort (optional)
    { $sort: { propertyCount: -1 } }
  ]);

  return { items:result};
};
exports.getTopProperty = async ({  filters={} } = {}) => {
  const matchCondition = { isDeleted: false, isActive:true, isTop:true };
  const items = await Property.find(matchCondition).select('title price currency images bedrooms bathrooms areaSqFt').sort({ createdAt: -1 });
  return { items:items};
};

exports.toggleStatus = async (id,key, isActive) => {
 const prop = await Property.findByIdAndUpdate(
    id,
    { $set: { [key]: isActive } }, // Dynamically sets or adds the key
    { new: true, runValidators: true } // returns updated doc
  );

  if (!prop) throw { status: 404, message: 'Property not found' };
  return prop;
};

exports.softDelete = async (id) => {
  const prop = await Property.findById(id);
  if (!prop) throw { status: 404, message: 'Property not found' };
  prop.isDeleted = true;
  await prop.save();
  return prop;
};
exports.getPropertyById = async (propertyId) => {
  const property = await Property.findById(propertyId)
    .populate('createdBy', 'name email role') // if createdBy is linked
    .populate('propertyType')
    .populate('city')
    .populate('state')
    .populate('country')
    .lean();

  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  return property;
};
exports.toggleLike = async (id, userId) => {
  const prop = await Property.findById(id);
  if (!prop || prop.isDeleted) throw { status: 404, message: 'Property not found' };
  const idx = prop.likes.findIndex(l => l.toString() === userId.toString());
  if (idx === -1) prop.likes.push(userId); else prop.likes.splice(idx,1);
  await prop.save();
  return prop;
};
