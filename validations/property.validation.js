const { body, param } = require('express-validator');

exports.createPropertyValidation = [
  body('title').notEmpty().withMessage('Title required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('propertyType').isMongoId().withMessage('Invalid property ID'),
  body('address.city').optional().isString(),
  body('bedrooms').optional().isNumeric(),
  body('bathrooms').optional().isNumeric()
];

exports.updatePropertyValidation = [
  body('title').optional().notEmpty(),
  body('price').optional().isNumeric(),
  body('propertyType')
    .optional()
    .isIn(['apartment', 'house', 'plot', 'commercial', 'other']),
  body('isActive').optional().isBoolean()
];

exports.getPropertyByIdValidation = [
  param('id').isMongoId().withMessage('Invalid property ID')
];
