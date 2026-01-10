const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');

// Protect all routes
router.use(auth);

router.get('/', expenseController.getExpenses);
router.get('/summary', expenseController.getExpenseSummary);
router.post('/', expenseController.createExpense);

module.exports = router;
