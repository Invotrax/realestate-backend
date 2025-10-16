const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const propCtrl = require('../controllers/property.controller');
const validate = require('../middlewares/validate.middleware');
const { createPropertyValidation, updatePropertyValidation } = require('../validations/property.validation');

// Admin / superadmin: manage properties
router.post('/', auth, permit('admin','superadmin'),createPropertyValidation, validate, propCtrl.createProperty);
router.get('/admin', auth, permit('admin','superadmin'), propCtrl.listAdmin);
router.put('/:id', auth, permit('admin','superadmin'),updatePropertyValidation, validate, propCtrl.updateProperty);
router.patch('/:id/isActive', auth, permit('admin','superadmin'), propCtrl.updateIsActive);
router.delete('/:id', auth, permit('admin','superadmin'), propCtrl.deleteProperty);

// End-user listing & like
router.get('/', propCtrl.listPublic); // no auth required; returns only active
router.post('/:id/like', auth, permit('user','admin','superadmin'), propCtrl.toggleLike);

module.exports = router;
