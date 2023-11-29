const express = require('express');
const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
    // Log the error
    console.error(err);
  
    // Check if it's a MongoDB validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      statusCode = 400;
      message = errors.join(', ');
    }
  
    // Check if it's a MongoDB duplicate key error
    if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate key error';
    }
  
    // Custom error handling based on the error type
  
    // Handle unauthorized errors
    if (err instanceof UnauthorizedError) {
      statusCode = 401;
      message = 'Unauthorized';
    }
  
    // Handle custom application-specific errors
    if (err instanceof CustomError) {
      statusCode = err.statusCode;
      message = err.message;
    }
  
    // Handle other errors
  
    // Send the error response
    res.status(statusCode).json({ error: message });
  });
  

  module.exports = error_handler;