const express = require('express');
const expensesController= require('../controllers/expensesController');// Import controller
const authenticate = require('../middleware/authMiddleware'); // JWT auth middleware

const router = express.Router();

// Create a new Expense
router.post('/', authenticate, expensesController.createExpense);

// Route to get all expenses for the authenticated user (protected by authentication)
router.get('/', authenticate, expensesController.getExpenses);

// Route to get all expenses for the authenticated user (protected by authentication)
router.get('/dates', authenticate, expensesController.getExpensesDates);

// Update an Expense by ID
router.put('/:id', authenticate,  expensesController.updateExpense);

// Delete a Daily Goal by ID
router.delete('/:id',authenticate,  expensesController.deleteExpense);

// Get balance sheet for a specific month
router.get('/balance-sheet', authenticate, expensesController.getBalanceSheet);

module.exports = router;