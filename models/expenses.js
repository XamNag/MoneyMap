const mongoose = require('mongoose');
const  expenseSchema= new mongoose.Schema({
    dayOfEntry: {
        type: Date, // Assuming you want to store the date of entry
        required: true
},
expenses: [
    {
      item: {
        type: String, // Name of the expense item
        required: true
      },
      value: {
        type: Number, // Expense value
        required: true
      },
      category: {
        type: String, // Category of the expense
        required: true
      }
    }
  ],
  perDayExpense: {
    type: Number, // Total expense for the day
    required: true
  },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId, // Assuming you want to link it to a user
//     ref: 'User', // Replace 'User' with the actual model name for users
//     required: true
//   }
});

// Create the Expense model
const Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;

