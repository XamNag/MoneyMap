const Expense = require('../models/expenses'); // Import the Expense model
const Income = require('../models/income'); // Import the Income model
const { expenseSchema } = require('../validations/expensesValidations'); // Import validation schema

// Create a new expense
const createExpense = async (req, res) => {
  try {
    // Validate request body with Joi
    const { error } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message }); // Return validation error
    }

        // Calculate perDayExpense *before* creating the Expense object
        const perDayExpense = req.body.expenses.reduce((total, expense) => total + expense.value, 0);

    // Create a new Expense instance
    const expense = new Expense({
      dayOfEntry: req.body.dayOfEntry,
      expenses: req.body.expenses,
      perDayExpense: perDayExpense,
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
        
         // Pagination parameters
         const page = parseInt(req.query.page) || 1; // Current page (default: 1)
         const limit = parseInt(req.query.limit) || 10; // Number of items per page (default: 10)
         const skip = (page - 1) * limit; // Number of items to skip

         
         // Fetch expenses for the authenticated user using their userId
         const expenses = await Expense.find({ userId })
         .skip(skip) // Skip items for previous pages
          .limit(limit); // Limit the number of items per page

         // Count total number of expenses for the user
         const totalExpenses = await Expense.countDocuments({ userId });

         // Calculate total pages
            const totalPages = Math.ceil(totalExpenses / limit);

       // Return the expenses with pagination metadata
         return res.status(200).json({
         message: 'Expenses retrieved successfully',
         expenses: expenses,
        pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalExpenses: totalExpenses,
        limit: limit,
      },
    });
    } catch (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

    // Get expenses between a start date and end date,  the duration between the two dates to no more than 2 monthsfor the authenticated user
    const getExpensesDates = async (req, res) => {
        try {
          const userId = req.user.userId; // Extracted from the JWT token
      
          // Extract startDate and endDate from query parameters
          const { startDate, endDate } = req.query;
      
          // Validate startDate and endDate
          if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Both startDate and endDate are required.' });
          }
      
          // Parse dates
          const start = new Date(startDate);
          const end = new Date(endDate);
          const today = new Date(); // Get current date
      
          // Validate date format
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
          }
      
          // Ensure startDate is before or equal to endDate
          if (start > end) {
            return res.status(400).json({ error: 'startDate must be before or equal to endDate.' });
          }

          // **Check if startDate or endDate is in the future**
            if (start > today || end > today) {
                return res.status(400).json({ error: 'startDate and endDate cannot be in the future.' });
            }
      
          // Calculate the difference in calendar months
          const startYear = start.getFullYear();
          const startMonth = start.getMonth();
          const endYear = end.getFullYear();
          const endMonth = end.getMonth();
      
          const monthDifference = (endYear - startYear) * 12 + (endMonth - startMonth);
      
          // Restrict duration to no more than 2 calendar months
          if (monthDifference > 2) {
            return res.status(400).json({ error: 'The duration between startDate and endDate cannot exceed 2 calendar months.' });
          }
      
          // Fetch expenses for the authenticated user within the date range
          const expenses = await Expense.find({
            userId,
            dayOfEntry: { $gte: start, $lte: end }, // Filter by date range
          });
      
          // Return the expenses
          return res.status(200).json({
            message: 'Expenses retrieved successfully',
            expenses: expenses,
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

   // get balance sheet
   const getBalanceSheet = async (req, res) => {
    try {
      const userId = req.user.userId; // Extracted from the JWT token
      const { month } = req.query; // Get the requested month (YYYY-MM)
  
      // Validate the month parameter
      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM.' });
      }
  
      // Calculate the start and end dates for the requested month
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of the month
  
      // Fetch expenses for the month
      const expenses = await Expense.find({
        userId,
        dayOfEntry: { $gte: startDate, $lte: endDate },
      });
  
      // Fetch incomes for the month
      const incomes = await Income.find({
        userId,
        dayOfEntry: { $gte: startDate, $lte: endDate },
      });
  
      // Generate daily expenses (including days with no transactions)
      const dailyExpenses = [];
      let totalExpenses = 0; // Initialize totalExpenses
  
      for (let day = 1; day <= endDate.getDate(); day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(day);
  
        const expenseForDay = expenses.find(
          (expense) => expense.dayOfEntry.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
        );
  
        const perDayExpense = expenseForDay ? expenseForDay.perDayExpense : 0;
        totalExpenses += perDayExpense; // Add to totalExpenses
  
        dailyExpenses.push({
          day: currentDate.toISOString().split('T')[0],
          perDayExpense: perDayExpense,
        });
      }
  
      // Generate incomes (only days with income records)
      const dailyIncomes = incomes.map((income) => ({
        day: income.dayOfEntry.toISOString().split('T')[0],
        value: income.value,
      }));
  
      const totalIncomes = incomes.reduce((total, income) => total + income.value, 0);
  
      // Calculate balance
      const balance = totalIncomes - totalExpenses;
  
      // Return the balance sheet
      return res.status(200).json({
        message: 'Balance sheet retrieved successfully',
        balanceSheet: {
          month: month,
          expenses: dailyExpenses,
          incomes: dailyIncomes,
          totalExpenses: totalExpenses, // Now correctly calculated
          totalIncomes: totalIncomes,
          balance: balance,
        },
      });
    } catch (err) {
      console.error('Error fetching balance sheet:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
   
module.exports = { createExpense, 
                   getExpenses,
                   getExpensesDates,
                   updateExpense,
                   deleteExpense,
                   getBalanceSheet};