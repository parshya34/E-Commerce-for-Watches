import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    
    // Calculate total revenue
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Get recent orders with totalPrice as totalAmount for dashboard display
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'email')
      .lean();
      
    // Map the orders to include totalAmount property for frontend consistency
    const formattedRecentOrders = recentOrders.map(order => ({
      ...order,
      totalAmount: order.totalPrice, // Add totalAmount property for dashboard display
      date: order.createdAt,
      status: order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'
    }));
    
    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders: formattedRecentOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;