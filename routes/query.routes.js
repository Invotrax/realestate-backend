const express = require('express');
const router = express.Router();
const queryCtrl = require('../controllers/query.controller');
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createQueryValidation } = require('../validations/query.validation');

// create from end-user (or guest)
router.post('/',createQueryValidation, validate, queryCtrl.createQuery);

// admin listing with pagination and filters
router.get('/', auth, permit('admin','superadmin'), queryCtrl.listQueries);

module.exports = router;
