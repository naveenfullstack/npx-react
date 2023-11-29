const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Extract the access token from headers, body, query parameters, or cookies
    const accessToken = req.headers.authorization?.split(' ')[1] || '';

    // Verify the access token
    const decodedToken = jwt.verify(accessToken, process.env.SECRET_KEY);

    // Attach the decoded user information to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or missing access token
    res.status(401).json({ error: 'Unauthorized' });
  }
};


module.exports = authMiddleware;
