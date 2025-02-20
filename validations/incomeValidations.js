const Joi = require('joi');

// Define the validation schema for the income with custom error messages
const incomeSchema = Joi.object({
  dayOfEntry: Joi.date().required().messages({
    'any.required': 'Day of entry is required.',
    'date.base': 'Day of entry must be a valid date.',
  }),
  value: Joi.number().positive().required().messages({
    'any.required': 'Income value is required.',
    'number.base': 'Income value must be a number.',
    'number.positive': 'Income value must be a positive number.',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required.',
    'string.base': 'Description must be a string.',
  }),
  userId: Joi.string().alphanum().length(24).required().messages({
    'any.required': 'User ID is required.',
    'string.base': 'User ID must be a string.',
    'string.alphanum': 'User ID must be alphanumeric.',
    'string.length': 'User ID must be 24 characters long.',
  }),
});

module.exports = { incomeSchema };