const express = require('express');
const authController = require('./../controllers/authController');
const authenticate = require('./../middlewares/authMiddleware');
const { User } = require('./../models');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/user-info', authenticate, authController.userInfo);

module.exports = router;