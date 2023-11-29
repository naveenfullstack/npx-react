const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60000, // 1 second
  max: 100, // 10 requests per windowMs
  message: {
    success: "true",
    data: "Too many requests. Please try again later",
  },
});

module.exports = limiter;
