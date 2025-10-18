const express = require('express');
const router = express.Router();
const controller = require('../controllers/propertyTypeController');
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');

// Admin Routes
router.post('/admin', auth, permit('admin','superadmin'), controller.create);
router.get('/admin', auth, permit('admin','superadmin'), controller.getAllAdmin);
router.patch('/:id/update-status', auth, permit('admin','superadmin'), controller.updateStatus);
router.delete('/admin/:id', auth, permit('admin','superadmin'), controller.markDelete);

// Public Route
router.get('/', controller.listActive);
router.get('/user/get-featured', controller.getFeatured);

module.exports = router;
