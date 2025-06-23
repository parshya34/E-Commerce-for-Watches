import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/user', protect, getUserOrders); // Keep old route for backward compatibility
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router;