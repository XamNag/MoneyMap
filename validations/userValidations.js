const Joi = require('joi');

// Define a regular expression for email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Define the validation schema for creating a user with custom error messages and email format validation
const registerUserSchema = Joi.object({
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required.',
      'string.empty': 'First name cannot be empty.',
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required.',
      'string.empty': 'Last name cannot be empty.',
    }),
    email: Joi.string()
      .required()
      .regex(emailRegex)
      .messages({
        'any.required': 'Email is required.',
        'string.empty': 'Email cannot be empty.',
        'string.pattern.base': 'Email must be a valid email address.',
      }),
    // username: Joi.string().alphanum().min(3).max(30).required().messages({
    //   'any.required': 'Username is required.',
    //   'string.empty': 'Username cannot be empty.',
    //   'string.alphanum': 'Username must contain only alphanumeric characters.',
    //   'string.min': 'Username must be at least 3 characters long.',
    //   'string.max': 'Username cannot exceed 30 characters.',
    // }),
    password: Joi.string().min(6).required().messages({
      'any.required': 'Password is required.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 6 characters long.',
    }),
  });
  
  module.exports = {
    registerUserSchema,
  };