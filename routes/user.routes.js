const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const { createUserValidation, updateUserValidation } = require('../validations/user.validation');

// Admin & Superadmin routes
router.use(auth);
// 🔐 Create user (Superadmin only)
router.post(
  '/create',
  auth,
  permit('superadmin'),
  createUserValidation,
  validate,
  userController.superadminCreateUser
);
router.get('/', permit('superadmin','admin'), userController.listUsers);
router.get('/:id', permit('superadmin','admin'), userController.getUser);
router.put('/:id', permit('superadmin','admin'), updateUserValidation, validate,  userController.updateUser);
router.patch('/:id/block', permit('superadmin','admin'), userController.blockUser);
router.delete('/:id', permit('superadmin','admin'), userController.deleteUser);

// Self update
router.put('/me',updateUserValidation, validate,  auth, userController.updateMe);

module.exports = router;
