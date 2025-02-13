const express = require('express');
const app = express();

// Import your route files
const user = require('./user');
const expensesRoutes = require('./expensesRoutes');


// Use the imported routes
app.use('/user', user);
app.use('/expenses', expensesRoutes);

module.exports=app;