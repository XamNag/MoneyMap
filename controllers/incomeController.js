const Income = require('../models/income'); // Import the Income model
const { incomeSchema } = require('../validations/incomeValidations'); // Import validation schema

// Create a new income
const createIncome = async(req,res) => {
    try {
         // Log the request body for debugging
           console.log(req.body);
        // Validate request body with Joi
        const { error } = incomeSchema.validate(req.body);
        if(error){
            return res.status(400).json({ error: error.details[0].message }); // Return validation error
        }

        // create a new Income instance

        const income = new Income({
            dayOfEntry: req.body.dayOfEntry,
            value: req.body.value,
            description:req.body.description,
            userId: req.user.userId  // Use the authenticated user's ID from the request
        });

        // save the income to the database
        const savedIncome = await income.save();

        // return success response
        return res.status(201).json({
            message: 'Income created Successfully',
            income:savedIncome
        });      

        }
        catch (err) {
            console.error('Error creating expense:', err);
            return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all income for the authenticated user
const getIncomes = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the JWT token
        // Fetch incomes for the authenticated user using their userId
         const income = await Income.find({ userId });
  
      // Return the income
      return res.status(200).json({
        message: 'income retrieved successfully',
        income: income
      });
    } catch (err) {
      console.error('Error fetching income:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // update an income for the authenticated user

  const updateIncome = async (req, res) => {
    try {
      const { id } = req.params;
      
      const { dayOfEntry, income } = req.body;
      const userId = req.user.userId; // Extracted from the JWT token

      // Ensure the income belongs to the authenticated user
      const updatedIncome = await Income.findOneAndUpdate(
        { _id: id, userId }, // Query: Ensure the income belongs to the user
        { dayOfEntry, income }, // Update fields
        { new: true } // Return the updated document
      );
  
      if (!updatedIncome) {
        return res.status(404).json({ error: 'Income not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Income updated successfully', income: updateIncome });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update income', details: err.message });
    }
  };


// Delete an income for the authenticated user
const deleteIncome = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
  
      const deletedIncome = await Income.findOneAndDelete({ _id: id, userId });
  
      if (!deletedIncome) {
        return res.status(404).json({ error: 'Expense not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Income deleted successfully', expense: deletedIncome });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete income', details: err.message });
    }
  };



module.exports = { createIncome,  getIncomes,  updateIncome,deleteIncome};