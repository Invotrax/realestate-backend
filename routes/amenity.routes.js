const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenity.controller');
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');

// Admin Routes
router.post('/admin', auth, permit('admin','superadmin'), amenityController.createAmenity);
router.get('/admin', auth, permit('admin','superadmin'), amenityController.getAdminAmenities);
router.get('/admin/:id', auth, permit('admin','superadmin'), amenityController.getAmenityById);
router.patch('/admin/:id/status', auth, permit('admin','superadmin'), amenityController.updateStatus);
router.delete('/admin/:id', auth, permit('admin','superadmin'), amenityController.softDelete);

// Public Route
router.get('/', amenityController.getPublicAmenities);

module.exports = router;
