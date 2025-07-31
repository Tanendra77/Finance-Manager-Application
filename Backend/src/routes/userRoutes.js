const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { registerValidation, loginValidation, handleValidationErrors } = require('../validations/userValidation');
const { authenticateToken } = require('../middlewares/auth');

// Public
router.post('/register', registerValidation, handleValidationErrors, userController.registerUser);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);
router.post('/login', loginValidation, handleValidationErrors, userController.loginUser);

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Protected
router.get('/profile', authenticateToken, userController.getUserProfile);
router.put('/update-password', authenticateToken, userController.updatePassword);

module.exports = router;
