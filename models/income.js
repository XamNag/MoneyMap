const mongoose = require("mongoose");
const  incomeSchema= new mongoose.Schema({
    dayOfEntry: {
        type: Date, // Assuming you want to store the date of entry
        required: true
},
  value: {
    type: Number, // income value
    required: true
  },
  description: {
    type: String, // description of the income
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you want to link it to a user
    ref: 'User', // Replace 'User' with the actual model name for users
    required: true
  }
});

// Create the Income model
const Income = mongoose.model('income', incomeSchema);

module.exports = Income;
