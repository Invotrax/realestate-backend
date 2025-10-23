const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const propCtrl = require('../controllers/property.controller');
const validate = require('../middlewares/validate.middleware');
const { createPropertyValidation, updatePropertyValidation, getPropertyByIdValidation, deleteGalleryImageValidation } = require('../validations/property.validation');
const upload = require('../middlewares/upload.middleware');
// Admin / superadmin: manage properties
router.post('/', 
    auth, permit('admin','superadmin'),
    
     upload.fields([
        { name: 'cardImage', maxCount: 1 },
        { name: 'images', maxCount: 5 }
    ]),
    createPropertyValidation, validate,
     propCtrl.createProperty);
router.get('/admin', auth, permit('admin','superadmin'), propCtrl.listAdmin);
router.put('/:id', 
    
    auth, permit('admin','superadmin'),
    upload.fields([
        { name: 'cardImage', maxCount: 1 },
        { name: 'images', maxCount: 5 }
    ]),
    updatePropertyValidation, validate, propCtrl.updateProperty);
router.put('/delete-image/:id', deleteGalleryImageValidation, validate, propCtrl.deleteGalleryImageByUrl);
router.patch('/:id/update-status', auth, permit('admin','superadmin'), propCtrl.updateStatus);
router.delete('/:id', auth, permit('admin','superadmin'), propCtrl.deleteProperty);
router.get('/:id', getPropertyByIdValidation, validate, propCtrl.getPropertyById);

// End-user listing & like
router.get('/', propCtrl.listPublic); // no auth required; returns only active
router.get('/user/get-by-country', propCtrl.getByCountry);
router.get('/user/get-top-list', propCtrl.getTopList);
router.get('/user/similar', propCtrl.listPublic);
router.get('/user/:id', getPropertyByIdValidation, validate, propCtrl.getPropertyById);
router.post('/:id/like', auth, permit('user'), propCtrl.toggleLike);

module.exports = router;
