const propertyService = require('../services/property.service');

exports.createProperty = async (req, res) => {
  const payload = { ...req.body, owner: req.user._id };
  const prop = await propertyService.create(payload);
  res.status(201).json({ success: true, data: prop });
};

exports.listAdmin = async (req, res) => {
  const { page=1, limit=10, q, city, isActive } = req.query;
  const filters = {};
  if (q) filters.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }];
  if (city) filters['address.city'] = city;
  if (isActive !== undefined) filters.isActive = isActive === 'true';
  const result = await propertyService.listAdmin({ page: Number(page), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};

exports.updateProperty = async (req, res) => {
  const prop = await propertyService.update(req.params.id, req.body);
  res.json({ success: true, data: prop });
};

exports.updateIsActive = async (req, res) => {
  const { isActive } = req.body;
  const prop = await propertyService.toggleIsActive(req.params.id, !!isActive);
  res.json({ success: true, data: prop });
};

exports.deleteProperty = async (req, res) => {
  const prop = await propertyService.softDelete(req.params.id);
  res.json({ success: true });
};

exports.listPublic = async (req, res) => {
  const { page=1, limit=10, q, city, minPrice, maxPrice, propertyType } = req.query;
  const filters = {};
  if (q) filters.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }];
  if (city) filters['address.city'] = city;
  if (propertyType) filters.propertyType = propertyType;
  if (minPrice || maxPrice) filters.price = {};
  if (minPrice) filters.price.$gte = Number(minPrice);
  if (maxPrice) filters.price.$lte = Number(maxPrice);
  const result = await propertyService.listPublic({ page: Number(page), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};

exports.toggleLike = async (req, res) => {
  const prop = await propertyService.toggleLike(req.params.id, req.user._id);
  res.json({ success: true, likesCount: prop.likes.length, liked: prop.likes.some(l => l.toString() === req.user._id.toString()) });
};
