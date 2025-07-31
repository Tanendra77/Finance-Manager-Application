const express = require('express');
const router = express.Router();
const recurringController = require('../controllers/recurringController');
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken); // Protect all routes

router.get('/', recurringController.getRecurringTransactions);
router.post('/', recurringController.createRecurringTransaction);
router.put('/:id', recurringController.updateRecurringTransaction);
router.delete('/:id', recurringController.deleteRecurringTransaction);

module.exports = router;
