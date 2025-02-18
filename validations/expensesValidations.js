const Joi = require('joi');

const expenseSchema = Joi.object({
  dayOfEntry: Joi.date().required().messages({
    'any.required': 'Day of entry is required.',
    'date.base': 'Day of entry must be a valid date.',
  }),
  expenses: Joi.array()
    .items(
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
    )
    .min(1)
    .required()
    .messages({
      'any.required': 'Expenses are required.',
      'array.base': 'Expenses must be an array.',
      'array.min': 'At least one expense item is required.',
    }),
});

module.exports = { expenseSchema };