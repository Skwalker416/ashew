const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const { body } = require('express-validator')

const validateUser = [
    body('firstName').not().isEmpty().withMessage('user first name is required'),
    body('lastName').not().isEmpty().withMessage('user last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isStrongPassword().withMessage('Password must contain at least one uppercase or symbol'),
    body('phone').isMobilePhone().withMessage('Please enter a valid phone number')

];

const validateVendor = [
    body('vendorName').not().isEmpty().withMessage('Vendor name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isStrongPassword().withMessage('Password must contain at least one uppercase or symbol'),
    body('phone').isMobilePhone().withMessage('Please enter a valid phone number')
];

const validateEventOrganizer = [
    body('eventOrganizerName').not().isEmpty().withMessage('EventOrganizer name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isStrongPassword().withMessage('Password must contain at least one uppercase or symbol'),
    body('phone').isMobilePhone().withMessage('Please enter a valid phone number')
];

validatePassword = [
    body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isStrongPassword().withMessage('Password must contain at least one uppercase or symbol')
]

router.post('/login/user', authController.login);
router.post('/login/vendor', authController.login);
router.post('/login/eventOrganizer', authController.login);

router.post('/register/user', validateUser, authController.register);
router.post('/register/vendor', validateVendor, authController.register);
router.post('/register/eventOrganizer', validateEventOrganizer, authController.register);


router.post('/verify-Token', authController.verifyToken);

router.post('/forgot-password/user', authController.forgotPassword)
router.post('/forgot-password/vendor', authController.forgotPassword)
router.post('/forgot-password/eventOrganizer', authController.forgotPassword)

router.post('/verify-otp/user', authController.verifyOtpResetPassword)
router.post('/verify-otp/vendor', authController.verifyOtpResetPassword)
router.post('/verify-otp/eventOrganizer', authController.verifyOtpResetPassword)

router.post('/reset-password/user', validatePassword, authController.resetPassword)
router.post('/reset-password/vendor', validatePassword, authController.resetPassword)
router.post('/reset-password/eventOrganizer', validatePassword, authController.resetPassword)

module.exports = router;