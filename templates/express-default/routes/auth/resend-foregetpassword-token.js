const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/resend-token/:resetToken', async (req, res) => {
    try {
      const { newPassword } = req.body;
      const { resetToken } = req.params;
  
      // Decode the token
      // const decodedToken = jwt.decode(token);
      const decodedToken = jwt.verify(resetToken, process.env.SECRET_KEY);
  
      // Find the user by decoded token (user id)
      const user = await User.findById(decodedToken.userId);
  
      if (!user) {
        return res.status(404).json({ error });
      }
  
      user.oldpassword = user.password;
  
      // Generate hashed password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      user.resetToken = undefined; // Clear the reset token
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error });
    }
  });

  module.exports = router;