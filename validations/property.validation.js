const { body } = require('express-validator');

exports.createPropertyValidation = [
  body('title').notEmpty().withMessage('Title required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('propertyType')
    .optional()
    .isIn(['apartment', 'house', 'plot', 'commercial', 'other'])
    .withMessage('Invalid property type'),
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
