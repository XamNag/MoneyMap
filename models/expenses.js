const mongoose = require('mongoose');

// Define the schema for expenses
const expenseSchema = new mongoose.Schema({
    dayOfEntry: {
        type: Date, // Date of entry for the expense
        required: true, // Ensuring the field is required
    },
    expenses: [
        {
            item: {
                type: String, // Name of the expense item
                required: true, // Ensuring the field is required
            },
            value: {
                type: Number, // Expense value
                required: true, // Ensuring the field is required
            },
            category: {
                type: String, // Category of the expense
                required: true, // Ensuring the field is required
                enum: ['Food', 'Transport', 'Utilities', 'Others'], // Adding Enum for categories
            }
        }
    ],
    perDayExpense: {
        type: Number, // Total expense for the day
        required: true, // Ensuring the field is required
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a user
        ref: 'User', // Replace 'User' with the actual model name for users
        required: true, // Ensuring the field is required
    }
});

// Create the Expense model using the schema
const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;