// API URL based on environment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Payment related
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

// Order status options
export const ORDER_STATUS = [
  'Order placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered'
];

// Product categories
export const PRODUCT_CATEGORIES = ['male', 'female'];

// Default admin credentials
export const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

// Constants for pagination
export const ITEMS_PER_PAGE = 8;