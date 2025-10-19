const { body, param } = require('express-validator');

exports.createStateValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('country_id').isMongoId().withMessage('Invalid country ID')
];

exports.updateStateValidation = [
 body('name').notEmpty().withMessage('Name required'),
  body('country_id').isMongoId().withMessage('Invalid country ID')
];

exports.getStateByIdValidation = [
  param('id').isMongoId().withMessage('Invalid State ID')
];
