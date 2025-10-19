const State = require('../models/State');

exports.create = async (payload) => {
  const prop = new State(payload);
  await prop.save();
  return prop;
};

exports.update = async (id, payload) => {
  const prop = await State.findById(id);
  if (!prop) throw { status: 404, message: 'State not found' };
  Object.assign(prop, payload);
  await prop.save();
  return prop;
};

exports.listAdmin = async ({ page=1, limit=10, filters={} }) => {
  const skip = (page-1)*limit;
  const query = { ...filters }; // admins see all including inactive and deleted if desired; adjust
  const total = await State.countDocuments(query);
  const items = await State.find(query)
  .populate('country_id', 'name')
  .skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit};
};

exports.toggleStatus = async (id, isActive) => {
 const prop = await State.findByIdAndUpdate(
    id,
    { $set: { isActive: isActive } }, // Dynamically sets or adds the key
    { new: true, runValidators: true } // returns updated doc
  );

  if (!prop) throw { status: 404, message: 'State not found' };
  return prop;
};

exports.getStateById = async (stateId) => {
  const state = await State.findById(stateId)
    .populate('country_id', 'name') 
    .lean();

  if (!state) {
    const error = new Error('State not found');
    error.statusCode = 404;
    throw error;
  }

  return state;
};
