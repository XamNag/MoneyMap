const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  
    firstName: String,
    lastName: String,
    email: {
      type: String,
      default: 'default@example.com',
      unique: true,
    },
    password: String,
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  