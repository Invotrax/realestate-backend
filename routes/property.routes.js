const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const propCtrl = require('../controllers/property.controller');
const validate = require('../middlewares/validate.middleware');
const { createPropertyValidation, updatePropertyValidation, getPropertyByIdValidation } = require('../validations/property.validation');
const upload = require('../middlewares/upload.middleware');
// Admin / superadmin: manage properties
router.post('/', 
    auth, permit('admin','superadmin'),
     upload.array('images', 5),
    createPropertyValidation, validate,
     propCtrl.createProperty);
router.get('/admin', auth, permit('admin','superadmin'), propCtrl.listAdmin);
router.put('/:id', 
    auth, permit('admin','superadmin'),
    upload.array('images', 5),
    updatePropertyValidation, validate, propCtrl.updateProperty);
router.patch('/:id/isActive', auth, permit('admin','superadmin'), propCtrl.updateIsActive);
router.delete('/:id', auth, permit('admin','superadmin'), propCtrl.deleteProperty);
router.get('/:id', getPropertyByIdValidation, validate, propCtrl.getPropertyById);

// End-user listing & like
router.get('/', propCtrl.listPublic); // no auth required; returns only active
router.get('/user/get-by-country', propCtrl.getByCountry);
router.post('/:id/like', auth, permit('user'), propCtrl.toggleLike);

module.exports = router;
