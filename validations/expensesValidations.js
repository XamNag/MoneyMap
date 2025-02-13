const Joi = require('joi');

// Define the validation schema for the expense with custom error messages
const expenseSchema = Joi.object({
  dayOfEntry: Joi.date().required().messages({
    'any.required': 'Day of entry is required.',
    'date.base': 'Day of entry must be a valid date.',
  }),
  expenses: Joi.array().items(
    Joi.object({
      item: Joi.string().required().messages({
        'any.required': 'Expense item is required.',
        'string.base': 'Expense item must be a string.',
      }),
      value: Joi.number().positive().required().messages({
        'any.required': 'Expense value is required.',
        'number.base': 'Expense value must be a number.',
        'number.positive': 'Expense value must be a positive number.',
      }),
      category: Joi.string().required().messages({
        'any.required': 'Expense category is required.',
        'string.base': 'Expense category must be a string.',
      }),
    })
  ).min(1).required().messages({
    'any.required': 'Expenses are required.',
    'array.base': 'Expenses must be an array.',
    'array.min': 'At least one expense item is required.',
  }),
  perDayExpense: Joi.number().positive().required().messages({
    'any.required': 'Per day expense is required.',
    'number.base': 'Per day expense must be a number.',
    'number.positive': 'Per day expense must be a positive number.',
  }),
  userId: Joi.string().alphanum().length(24).required().messages({
    'any.required': 'User ID is required.',
    'string.base': 'User ID must be a string.',
    'string.alphanum': 'User ID must be alphanumeric.',
    'string.length': 'User ID must be 24 characters long.',
  })
});

module.exports = { expenseSchema };
