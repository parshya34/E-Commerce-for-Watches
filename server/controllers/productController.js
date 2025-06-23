import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      bestseller, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let query = {};
    
    // Apply filters
    if (category) {
      query.category = category;
    }
    
    if (bestseller === 'true') {
      query.isBestseller = true;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isBestseller } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a product image' });
    }
    
    // Get image path
    const image = `/uploads/${req.file.filename}`;
    
    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      isBestseller: isBestseller === 'true'
    });
    
    const createdProduct = await product.save();
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, isBestseller, inStock } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (isBestseller !== undefined) product.isBestseller = isBestseller === 'true';
    if (inStock !== undefined) product.inStock = inStock === 'true';
    
    // Handle new image if any
    if (req.file) {
      // If there's an existing image, delete it from the server
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set the new image path
      product.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product image from server
    if (product.image) {
      const fullPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    await product.deleteOne();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};