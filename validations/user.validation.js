const { body } = require('express-validator');

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['superadmin', 'admin', 'user'])
    .withMessage('Invalid role value')
];

exports.updateUserValidation = [
  body('name').optional().isString(),
  body('mobile').optional().isString(),
  body('address').optional().isString(),
  body('role').optional().isIn(['superadmin', 'admin', 'user']),
  body('isActive').optional().isBoolean(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];
