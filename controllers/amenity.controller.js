const amenityService = require('../services/amenity.service');

exports.createAmenity = async (req, res) => {
  try {
    const data = req.body;
    const amenity = await amenityService.createAmenity(data);
    res.status(201).json({ success: true, message: 'Amenity created successfully', data: amenity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAdminAmenities = async (req, res) => {
  try {
    const amenities = await amenityService.getAdminAmenities();
    res.json({ success: true, data: amenities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAmenityById = async (req, res) => {
  try {
    const amenity = await amenityService.getAmenityById(req.params.id);
    res.json({ success: true, data: amenity });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const amenity = await amenityService.updateStatus(req.params.id, !!isActive);
    res.json({ success: true, message: 'Status updated successfully', data: amenity });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    await amenityService.softDelete(req.params.id);
    res.json({ success: true, message: 'Amenity deleted successfully' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getPublicAmenities = async (req, res) => {
  try {
    const amenities = await amenityService.getPublicAmenities();
    res.json({ success: true, data: amenities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
