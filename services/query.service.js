const Query = require('../models/Query');

exports.create = async (payload) => {
  const q = new Query(payload);
  await q.save();
  return q;
};

exports.list = async ({ page=1, limit=10, filters = {} }) => {
  const skip = (page-1)*limit;
  const total = await Query.countDocuments(filters);
  const items = await Query.find(filters).populate('property','title').skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit };
};
