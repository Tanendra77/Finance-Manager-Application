const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Ensure authentication middleware runs before multer to populate req.user
router.use(authenticateToken);

// Get transactions (with optional filters & pagination can be added later)
router.get('/', transactionController.getTransactions);

// Create transaction with optional receipt file upload
router.post(
  '/',
  upload.single('receipt'),
  transactionController.createTransaction
);

// Update transaction with optional receipt file upload
router.put(
  '/:id',
  upload.single('receipt'),
  transactionController.updateTransaction
);

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
