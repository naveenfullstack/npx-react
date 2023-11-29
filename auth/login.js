const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const signupMail = require('@sendgrid/mail');

signupMail.setApiKey(process.env.SENDGRID_KEY);

router.post("/",  async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by the provided username
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the account is blocked
    if (user.is_blocked) {
      return res.status(401).json({ error: 'Your account has been blocked. Please contact support for assistance.' });
    }

    if (await bcrypt.compare(password, user.oldpassword)) {
      return res.status(401).json({ error: 'Old password' });
    }

    //const isPasswordValid = jwt.verify(user.password, process.env.SECRET_KEY);
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: "Invalid password" });
    // }

    // Check if the entered password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment the failed login attempts count
      user.failedLoginAttempts += 1;
      await user.save();

      // Check if the failed login attempts threshold is reached
      if (user.failedLoginAttempts >= 3) {
        // Send an email notification using SendGrid
        const msg = {
          to: user.email,
          from: {
            email: process.env.SENDING_EMAIL,
            name: process.env.COMPANY_NAME
          },
          subject: 'Multiple Failed Login Attempts',
          text: 'Your account has experienced multiple failed login attempts. Please review your account security.',
        };
        await signupMail.send(msg);
      }

      return res.status(401).json({ error: 'Invalid password' });
    }


    // Generate an access token with a short expiration time
    const accessToken = jwt.sign(
      { userId: user._id },
      "your_access_token_secret",
      {
        expiresIn: "15m",
      }
    );

    // Generate a refresh token with a longer expiration time
    const refreshToken = jwt.sign(
      { userId: user._id },
      "your_refresh_token_secret",
      {
        expiresIn: "15d",
      }
    );

    // Save accesstoken and refeshtoken in db
    user.failedLoginAttempts = 0;
    //user.is_blocked = true;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res
      .status(200)
      .json({ success: "true", message: "Login Success", accessToken, refreshToken });
    
    next();
  
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
