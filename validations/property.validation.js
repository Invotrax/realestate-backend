const { body, param } = require('express-validator');

exports.createPropertyValidation = [
  body('title').notEmpty().withMessage('Title required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('propertyType').isMongoId().withMessage('Invalid property ID'),
  body('address.city').optional().isString(),
  body('bedrooms').optional().isNumeric(),
  body('bathrooms').optional().isNumeric(),
  body('dldPermit').notEmpty().withMessage('DLD Permit required'),
];

exports.updatePropertyValidation = [
  body('title').optional().notEmpty(),
  body('price').optional().isNumeric(),
  body('propertyType').isMongoId().withMessage('Invalid property ID'),
  body('isActive').optional().isBoolean(),
  body('dldPermit').notEmpty().withMessage('DLD Permit required'),
];
exports.deleteGalleryImageValidation = [
  body('imageUrl').notEmpty().withMessage('image url required'),
];

exports.getPropertyByIdValidation = [
  param('id').isMongoId().withMessage('Invalid property ID')
];
