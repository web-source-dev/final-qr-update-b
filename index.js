const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Initialize app
const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests

// CORS Configuration
const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));  // Apply CORS options globally
app.options('*', cors(corsOptions));  // Enable preflight for all routes

// Static directory for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Uploads directory path:', path.join(__dirname, 'uploads'));  // Log uploads path for debugging

// MongoDB Connection using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log('MongoDB connected with Mongoose...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Consider adding a reconnection attempt here if needed
  }
};

// Connect to DB
connectDB();

// Routes
const userRoutes = require('./Routes/userroute');
app.use('/api', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the QR Code API!');
});

// Set up port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
