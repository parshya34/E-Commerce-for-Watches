import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Checking MongoDB connection...');

// Log environment variables (without sensitive data)
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT || '5000 (default)');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development (default)');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '[SET]' : '[NOT SET]');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '[SET]' : '[NOT SET]');
console.log('- CLIENT_URL:', process.env.CLIENT_URL || '[NOT SET]');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '[SET]' : '[NOT SET]');
console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '[SET]' : '[NOT SET]');

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      console.log('Attempting to connect to MongoDB using MONGODB_URI...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connected successfully!');
    } else {
      console.log('MONGODB_URI not found, trying local connection...');
      try {
        await mongoose.connect('mongodb://localhost:27017/watchstore', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to local MongoDB successfully!');
      } catch (localError) {
        console.error('❌ Local MongoDB connection failed:', localError.message);
        console.log('Please make sure MongoDB is running locally or set MONGODB_URI in your .env file');
      }
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('Please check your MONGODB_URI in the .env file');
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  }
};

// Run the connection test
connectDB().then(() => {
  console.log('Connection check complete');
  process.exit(0);
}).catch(err => {
  console.error('Connection check failed:', err);
  process.exit(1);
});
