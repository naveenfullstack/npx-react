const express = require("express");
const User = require("../../../models/user");

app.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
  });

module.exports = router;