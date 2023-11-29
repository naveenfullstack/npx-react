const express = require('express');
const User = require("../../../models/user");
const router = express.Router();

router.post('/check-token',  async (req, res) => {
    try {
      const { accessToken } = req.body;
  
      // Find the user in MongoDB by the access token
      const user = await User.findOne({ accessToken });
  
      if (!user) {
        console.error('Access token not found');
        return res.status(401).json({ message: 'Wrong token' });
      }
  
      console.log('Logged in');
      res.status(200).json({ message: 'Logged in' });
    } catch (error) {
      console.error('Error checking token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  router.post('/refresh-token', async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      // Find the user in MongoDB by the access token
      const user = await User.findOne({ refreshToken });
  
      if (!user) {
        return res.status(401).json({ message: 'Refreshrs token not found' });
      }
  
      res.status(200).json({ message: 'Autharized refresh token'  });
    } catch (error) {
      console.error('Error checking token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;