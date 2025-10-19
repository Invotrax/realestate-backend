const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const propCtrl = require('../controllers/state.controller');
const validate = require('../middlewares/validate.middleware');

const upload = require('../middlewares/upload.middleware');
const { createStateValidation, updateStateValidation, getStateByIdValidation } = require('../validations/state.validation');

router.post('/', 
    auth, permit('admin','superadmin'),
     upload.single('image'),
    createStateValidation, validate,
     propCtrl.createState);

router.put('/:id', 
    auth, permit('admin','superadmin'),
    upload.single('image'),
    updateStateValidation, validate, propCtrl.updateState);

router.get('/admin', auth, permit('admin','superadmin'), propCtrl.listAdmin);
router.patch('/:id/update-status', auth, permit('admin','superadmin'), propCtrl.updateStatus);

router.get('/:id', getStateByIdValidation, validate, propCtrl.getStateById);


module.exports = router;
