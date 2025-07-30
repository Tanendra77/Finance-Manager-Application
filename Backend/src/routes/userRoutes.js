const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../validations/userValidation');
const { authenticateToken } = require('../middlewares/auth');

// Public routes
router.post('/register', registerValidation, handleValidationErrors, userController.registerUser);
router.post('/login', loginValidation, handleValidationErrors, userController.loginUser);

// Protected routes
router.get('/profile', authenticateToken, userController.getUserProfile);

module.exports = router;
