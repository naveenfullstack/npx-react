const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendgridMail = require('@sendgrid/mail');
const User = require('../../../models/user');

sendgridMail.setApiKey(process.env.SENDGRID_KEY);

router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a JWT token with user id as payload and set it to expire in 1 hour
    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    user.resetToken = resetToken;
    await user.save();

    // Create the password reset email
    const resetEmail = {
      to: user.email,
      //from: process.env.SENDING_EMAIL,
      from: {
        email: process.env.SENDING_EMAIL,
        name: process.env.COMPANY_NAME
      },
      subject: 'Password Reset',
      //text: `Click the link below to reset your password:\n\n${req.headers.origin}/reset-password/${token}`,
      //text: `Your One-Time Password (OTP) for password reset is: ${otp}`,
      html: `
        <p>Click the link below to reset your password:</p>
        <p><a href="${req.headers.origin}/reset-password/${resetToken}">${req.headers.origin}/reset-password/${resetToken}</a></p>
        <p>${resetToken}</p>
      `,
    };

    // Send the password reset email
    await sendgridMail.send(resetEmail);

    res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password/:resetToken', async (req, res) => {
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
