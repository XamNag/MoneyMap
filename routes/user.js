// user.js

const express= require("express");
const router= express.Router();
const UserController = require('../controllers/userController');

// Create a new user
router.post('/register', UserController.registerUser);
router.post('/login', UserController.login);


module.exports = router;