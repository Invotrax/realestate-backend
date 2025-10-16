const queryService = require('../services/query.service');

exports.createQuery = async (req, res) => {
  const { name, email, subject, message, property } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, message: 'name,email,message required' });
  const q = await queryService.create({ name, email, subject, message, property });
  res.status(201).json({ success: true, data: q });
};

exports.listQueries = async (req, res) => {
  const { page=1, limit=10, property, fromDate, toDate } = req.query;
  const filters = {};
  if (property) filters.property = property;
  if (fromDate || toDate) {
    filters.createdAt = {};
    if (fromDate) filters.createdAt.$gte = new Date(fromDate);
    if (toDate) filters.createdAt.$lte = new Date(toDate);
  }
  const result = await queryService.list({ page: Number(page), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};
