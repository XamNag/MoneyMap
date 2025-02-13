const Expense = require('../models/expenses'); // Import the Expense model
const { expenseSchema } = require('../validations/expensesValidations'); // Import validation schema

// Create a new expense
const createExpense = async (req, res) => {
  try {
    // Validate request body with Joi
    const { error } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message }); // Return validation error
    }

    // Create a new Expense instance
    const expense = new Expense({
      dayOfEntry: req.body.dayOfEntry,
      expenses: req.body.expenses,
      perDayExpense: req.body.perDayExpense,
      userId: req.user.userId  // Use the authenticated user's ID from the request
    });

    // Save the expense to the database
    const savedExpense = await expense.save();

    // Return success response
    return res.status(201).json({
      message: 'Expense created successfully',
      expense: savedExpense
    });
  } catch (err) {
    console.error('Error creating expense:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all expenses for the authenticated user
const getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the JWT token
        // Fetch expenses for the authenticated user using their userId
         const expenses = await Expense.find({ userId });
  
      // Return the expenses
      return res.status(200).json({
        message: 'Expenses retrieved successfully',
        expenses: expenses
      });
    } catch (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // update an expense for the authenticated user

  const updateExpense = async (req, res) => {
    try {
      const { id } = req.params;
      
      const { dayOfEntry, expenses } = req.body;
      const userId = req.user.userId; // Extracted from the JWT token
  
      const perDayExpense = expenses.reduce((total, expense) => total + expense.value, 0);
      // Ensure the expense belongs to the authenticated user
      const updatedExpense = await Expense.findOneAndUpdate(
        { _id: id, userId }, // Query: Ensure the expense belongs to the user
        { dayOfEntry, expenses, perDayExpense }, // Update fields
        { new: true } // Return the updated document
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ error: 'Expense not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update expense', details: err.message });
    }
  };


  // Delete an expense for the authenticated user
  const deleteExpense = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
  
      const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });
  
      if (!deletedExpense) {
        return res.status(404).json({ error: 'Expense not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Expense deleted successfully', expense: deletedExpense });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete expense', details: err.message });
    }
  };

module.exports = { createExpense, 
                   getExpenses,
                   updateExpense,
                   deleteExpense};