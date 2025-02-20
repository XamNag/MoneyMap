const express = require('express');
const app = express();

// Import your route files
const user = require('./user');
const expensesRoutes = require('./expensesRoutes');
const incomeRoutes = require('./incomeRoute');


// Use the imported routes
app.use('/user', user);
app.use('/expenses', expensesRoutes);
app.use('/income', incomeRoutes);

module.exports=app;