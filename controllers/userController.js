const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User=require("../models/User");
const { registerUserSchema } = require('../validations/userValidations');

// Controller to register a new user
exports.registerUser = async (req, res) => {
    try {
      // Validate user input
      const { error, value } = registerUserSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      // Check if a user with the same email or username already exists
      const existingUser = await User.findOne({
        $or: [{ email: value.email }, { username: value.username }],
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email or username already exists.' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(value.password, saltRounds);
      value.password = hashedPassword;
  
      // REGISTER a new user
      const user = await User.create(value);
      user.password = undefined; // Remove the hashed password from the response
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error registering user' });
    }
  };

  // Controller for user authentication (login)
  exports.login = async (req, res)=> {
    try{
        const { email, password } = req.body;
        // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }// Compare the input password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // User is authenticated, generate a JWT token
    const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '7h' });

    // Return the token in the response
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error during authentication' });
  }
};