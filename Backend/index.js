// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./src/routes/userRoutes');// User authentication routes
const catagoryRoutes = require('./src/routes/catagoryRoutes');// catagory management routes
const transactionRoutes = require('./src/routes/transactionRoutes');// Transaction management routes
const recurringRoutes = require('./src/routes/recurringRoutes');// Recurring transactions routes
const budgetRoutes = require('./src/routes/budgetRoutes');// Budget management routes

const pool = require('./src/config/db'); // To ensure DB connection works on start

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(helmet()); // Secure headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/catagorys', catagoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recurring-transactions', recurringRoutes);
app.use('/api/budgets', budgetRoutes);

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
