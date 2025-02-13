const express = require('express');
const incomeController= require('../controllers/incomeController');// Import controller
const authenticate = require('../middleware/authMiddleware'); // JWT auth middleware

const router = express.Router();

// Create a new income
router.post('/', authenticate, incomeController.createIncome);

// Route to get all expenses for the authenticated user (protected by authentication)
//router.get('/', authenticate, incomeController.getExpenses);

// Update an Expense by ID
//router.put('/:id', authenticate,  incomeController.updateExpense);

// Delete a Daily Goal by ID
//router.delete('/:id',authenticate,  incomeController.deleteExpense);

module.exports = router;
