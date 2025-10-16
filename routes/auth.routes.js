const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { signupValidation, loginValidation } = require('../validations/auth.validation');
// end-user signup
router.post('/signup', signupValidation, validate, authController.signup);

// login (all roles)
router.post('/login',loginValidation, validate,  authController.login);

module.exports = router;
