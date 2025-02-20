const express = require('express');
const incomeController= require('../controllers/incomeController');// Import controller
const authenticate = require('../middleware/authMiddleware'); // JWT auth middleware

const router = express.Router();

// Create a new income
router.post('/', authenticate, incomeController.createIncome);

// Route to get all income for the authenticated user (protected by authentication)
router.get('/', authenticate, incomeController.getIncomes);

// Update an income by ID
router.put('/:id', authenticate,  incomeController.updateIncome);

// Delete an income by ID
router.delete('/:id',authenticate,  incomeController.deleteIncome);

module.exports = router;
