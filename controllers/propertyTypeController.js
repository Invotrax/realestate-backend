const service = require('../services/propertyTypeService');

// ✅ Create
exports.create = async (req, res) => {
  try {
    const data = await service.createPropertyType(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

// ✅ Get All (Admin)
exports.getAllAdmin = async (req, res) => {
  try {
    const data = await service.getAllPropertyTypesAdmin();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { isActive, key } = req.body;
  const prop = await service.toggleStatus(req.params.id, key, !!isActive);
  res.json({ success: true, data: prop });
};
// ✅ Mark Delete
exports.markDelete = async (req, res) => {
  try {
    const data = await service.markAsDeleted(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

// ✅ Public List
exports.listActive = async (req, res) => {
  try {
    const data = await service.getAllActivePropertyTypes();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const data = await service.getFeaturedPropertyType();
    res.json({ success: true, items:data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
