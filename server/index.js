import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB or use mock data
let useLocalData = false;
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });
      console.log('MongoDB connected successfully');
    } else {
      // Try to connect to local MongoDB if no URI provided
      try {
        await mongoose.connect('mongodb://localhost:27017/watchstore', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to local MongoDB');
      } catch (localError) {
        useLocalData = true;
        console.log('MongoDB URI not found and local connection failed. Using local mock data.');
        console.error('Local MongoDB error:', localError.message);
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    useLocalData = true;
    console.log('Falling back to local mock data');
  }
};

// Initialize database connection
connectDB();

// Initialize Supabase client if environment variables are available
export let supabase = null;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    console.log('Supabase client initialized successfully');
  } else {
    console.log('Supabase environment variables not found, running without Supabase');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error.message);
}

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock data for when MongoDB is not available
const mockProducts = [
  {
    _id: '1',
    name: 'Classic Silver Watch',
    price: 199.99,
    description: 'Elegant silver watch with leather strap',
    image: 'watch1.jpg',
    category: 'male',
    isBestseller: true
  },
  {
    _id: '2',
    name: 'Gold Luxury Watch',
    price: 299.99,
    description: 'Luxury gold watch with metal strap',
    image: 'watch2.jpg',
    category: 'female',
    isBestseller: true
  },
  {
    _id: '3',
    name: 'Sport Black Watch',
    price: 149.99,
    description: 'Sports watch with digital display',
    image: 'watch3.jpg',
    category: 'male',
    isBestseller: false
  },
  {
    _id: '4',
    name: 'Rose Gold Watch',
    price: 249.99,
    description: 'Elegant rose gold watch for women',
    image: 'watch4.jpg',
    category: 'female',
    isBestseller: true
  }
];

// Mock users for authentication when MongoDB is not available
let mockUsers = [
  {
    _id: 'admin1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', // admin123
    isAdmin: true
  }
];

// Middleware to provide mock data when MongoDB is not available
app.use('/api/products', (req, res, next) => {
  if (useLocalData) {
    console.log('Using mock product data');
    const { category, bestseller } = req.query;
    let filteredProducts = [...mockProducts];
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (bestseller === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isBestseller);
    }
    
    return res.json(filteredProducts);
  } else {
    // If not using local data, pass to the next middleware
    next();
  }
});

// Mock authentication middleware
app.post('/api/auth/register', async (req, res, next) => {
  if (useLocalData) {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = mockUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Import bcrypt for password hashing
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = {
        _id: 'user_' + Date.now(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin: false
      };
      
      mockUsers.push(newUser);
      console.log('Registered new mock user:', email);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      
      return res.status(201).json({
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          isAdmin: newUser.isAdmin
        },
        token
      });
    } catch (error) {
      console.error('Mock registration error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    // If not using local data, pass to the next middleware
    next();
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  if (useLocalData) {
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const user = mockUsers.find(user => user.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const bcrypt = await import('bcryptjs');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      
      console.log('Mock user logged in:', email);
      
      return res.json({
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
      console.error('Mock login error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    // If not using local data, pass to the next middleware
    next();
  }
});

app.post('/api/auth/admin/login', (req, res, next) => {
  if (useLocalData) {
    const { username, password } = req.body;
    
    // For demo purposes, using fixed admin credentials
    if (username === 'admin' && password === 'admin123') {
      const adminUser = mockUsers.find(user => user.email === 'admin@example.com');
      
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
  } else {
    // If not using local data, pass to the next middleware
    next();
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message || 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;