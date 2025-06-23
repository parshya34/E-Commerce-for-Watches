import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // For demo purposes, using fixed admin credentials
    // In a real app, this would be stored securely in the database
    if (username === 'admin' && password === 'admin123') {
      // Create or find admin user
      let adminUser = await User.findOne({ email: 'admin@example.com' });
      
      if (!adminUser) {
        adminUser = new User({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: 'admin123',
          isAdmin: true
        });
        
        await adminUser.save();
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: adminUser._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      
      return res.json({
        user: {
          _id: adminUser._id,
          email: adminUser.email,
          isAdmin: adminUser.isAdmin
        },
        token
      });
    }
    
    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google login
export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email_verified, name, email, given_name, family_name } = ticket.getPayload();
    
    if (!email_verified) {
      return res.status(400).json({ message: 'Email not verified by Google' });
    }
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Google credentials
      const password = email + process.env.JWT_SECRET;
      
      user = new User({
        firstName: given_name || name.split(' ')[0],
        lastName: family_name || name.split(' ').slice(1).join(' '),
        email,
        password,
        googleId: email
      });
      
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { firstName, lastName, email, password, address, phone } = req.body;
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      phone: updatedUser.phone
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Configure email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
      process.env.EMAIL_USER === 'your-email@gmail.com' || 
      process.env.EMAIL_PASSWORD === 'your-app-password') {
    console.warn('Email credentials not properly configured');
    return null;
  }
  
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// No longer using OTP for password reset

// Forgot password - generate reset token (no email verification)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 30); // Token valid for 30 minutes
    
    // Save reset token to user
    user.resetPasswordToken = {
      token: resetToken,
      expiresAt: resetTokenExpiry
    };
    
    await user.save();
    
    // Skip email sending completely
    console.log('Skipping email notification as per requirement');
    
    res.json({ 
      message: 'Password reset request processed successfully',
      resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// OTP verification removed - direct token-based reset is used instead

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if reset token exists and is valid
    if (!user.resetPasswordToken || !user.resetPasswordToken.token) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    
    // Check if token is expired
    if (new Date() > new Date(user.resetPasswordToken.expiresAt)) {
      return res.status(400).json({ message: 'Reset token expired' });
    }
    
    // Check if token matches
    if (user.resetPasswordToken.token !== resetToken) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear reset token
    user.resetPasswordToken = undefined;
    
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};