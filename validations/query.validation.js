const { body } = require('express-validator');

exports.createQueryValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').notEmpty().withMessage('Message required'),
  body('subject').optional().isString(),
  body('property').optional().isMongoId().withMessage('Invalid property ID')
];
