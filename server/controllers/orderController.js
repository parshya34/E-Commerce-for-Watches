import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentResult
    } = req.body;
    
    // Support both items and orderItems field names
    const orderItemsToUse = items || orderItems;
    
    if (!orderItemsToUse || orderItemsToUse.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItemsToUse,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentResult,
      isPaid: paymentResult ? true : false,
      paidAt: paymentResult ? Date.now() : null
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permission (admin or order owner)
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order to paid
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Set order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    
    // Create payment result with null checks to handle missing data
    const paymentResult = {
      id: req.body.id || `manual-payment-${Date.now()}`,
      status: req.body.status || 'completed',
      update_time: req.body.update_time || new Date().toISOString(),
      // Use a simple default email address to avoid undefined errors
      email_address: 'admin@example.com'
    };
    
    // If email is provided in the request body, use it
    if (req.body.email) {
      paymentResult.email_address = req.body.email;
    } 
    // If payer object is provided with email_address, use that
    else if (req.body.payer && req.body.payer.email_address) {
      paymentResult.email_address = req.body.payer.email_address;
    }
    
    // Set the payment result
    order.paymentResult = paymentResult;
    
    // Save the updated order
    const updatedOrder = await order.save();
    
    // Return the updated order
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order paid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order to delivered (admin only)
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order is already delivered
    if (order.isDelivered) {
      return res.status(400).json({ message: 'Order is already marked as delivered' });
    }
    
    // Check if order is paid
    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order must be paid before it can be delivered' });
    }
    
    // Mark order as delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    
    // Save the updated order
    const updatedOrder = await order.save();
    
    // Return the updated order
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order delivered error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};