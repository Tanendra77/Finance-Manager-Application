
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');  // you use passport.initialize() later, so import passport

const userRoutes = require('./src/routes/userRoutes');        // User authentication routes
const categoryRoutes = require('./src/routes/categoryRoutes'); // Category management routes
const transactionRoutes = require('./src/routes/transactionRoutes'); // Transaction routes
const recurringRoutes = require('./src/routes/recurringRoutes');     // Recurring transactions routes
const budgetRoutes = require('./src/routes/budgetRoutes');           // Budget management routes
const authRoutes = require('./src/routes/authRoutes');               // Google authentication routes
const reportRoutes = require('./src/routes/reportRoutes');           // Report generation routes
require('./src/jobRunner'); // Start recurring job runner

const pool = require('./src/config/db'); // DB connection 

const app = express(); 

// Serve static files (Recipt uploads folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());        // Enable CORS for frontend
app.use(helmet());      // Secure headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev'));  // Logging requests
app.use(passport.initialize());  // Initialize passport

// Routes
app.use('/api/users', userRoutes);               // Login/Register
app.use('/api/auth', authRoutes);                 // Google authentication
app.use('/api/categories', categoryRoutes);       // Category management (typo: consider changing 'catagorys' to 'categories')
app.use('/api/transactions', transactionRoutes); // Transaction management
app.use('/api/recurring-transactions', recurringRoutes); // Recurring transactions management
app.use('/api/budgets', budgetRoutes);           // Budget management
app.use('/api/reports', reportRoutes);          // Report generation routes

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Check DB Connection at startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected:', result.rows[0]);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
