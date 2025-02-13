const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const connectToMongoDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URL);
      console.log('Connected!');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };
  
  module.exports = connectToMongoDB