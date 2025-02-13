const Income = require('../models/income'); // Import the Income model
const { incomeSchema } = require('../validations/incomeValidations'); // Import validation schema

// Create a new income
const createIncome = async(req,res) => {
    try {
         // Log the request body for debugging
           console.log(req.body);
        // Validate request body with Joi
        const { error } = incomeSchema.validate(req.body);
        if(error){
            return res.status(400).json({ error: error.details[0].message }); // Return validation error
        }

        // create a new Income instance

        const income = new Income({
            dayOfEntry: req.body.dayOfEntry,
            value: req.body.value,
            description:req.body.description,
            userId: req.user.userId  // Use the authenticated user's ID from the request
        });

        // save the income to the database
        const savedIncome = await income.save();

        // return success response
        return res.status(201).json({
            message: 'Income created Successfully',
            income:savedIncome
        });      

        }
        catch (err) {
            console.error('Error creating expense:', err);
            return res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = { createIncome    };