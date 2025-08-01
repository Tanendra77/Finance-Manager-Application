const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/summary', reportController.getSummary);
router.get('/category-breakdown', reportController.getCategoryBreakdown);
router.get('/budget-vs-spending', reportController.getBudgetVsSpending);

module.exports = router;
