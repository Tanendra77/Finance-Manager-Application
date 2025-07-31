// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./src/routes/userRoutes');
const pool = require('./src/config/db'); // To ensure DB connection works on start

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(helmet()); // Secure headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging requests

// Routes
app.use('/api/users', userRoutes);

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
