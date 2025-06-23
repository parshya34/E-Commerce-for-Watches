import express from 'express';
import {
  register,
  login,
  adminLogin,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Test route to verify API is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working!' });
});

export default router;