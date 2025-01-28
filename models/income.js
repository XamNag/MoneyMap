const mongoose = require("mongoose");
const  incomeSchema= new mongoose.Schema({
    dayOfEntry: {
        type: Date, // Assuming you want to store the date of entry
        required: true
},
item: {
    type: String, // Name of the income item
    required: true
  },
  value: {
    type: Number, // income value
    required: true
  },
  category: {
    type: String, // Category of the income
    required: true
  },
  description: {
    type: String, // description of the income
    required: true
  }
});

// Create the Income model
const Income = mongoose.model('income', expenseSchema);

module.exports = Income;
