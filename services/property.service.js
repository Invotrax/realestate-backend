const Property = require('../models/Property');

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
  
  .skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit};
};

exports.listPublic = async ({ page=1, limit=10, filters={} } = {}) => {
  const skip = (page-1)*limit;
  const baseQuery = { isActive: true, isDeleted: false, ...filters };
  const total = await Property.countDocuments(baseQuery);
  const items = await Property.find(baseQuery).populate('createdBy', 'name').skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit};
};

exports.toggleIsActive = async (id, isActive) => {
  const prop = await Property.findById(id);
  if (!prop) throw { status: 404, message: 'Property not found' };
  prop.isActive = isActive;
  await prop.save();
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
