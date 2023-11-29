function header(req, res, next) {
  // Check if the required header exists and has the expected value
  if (
    req.headers['header'] !== 'expected-value' ||
    req.headers['header2'] !== 'expected-value2'
    ) {
    return res.status(400).json({ error: 'Invalid headers' });
  }

  next();
}

module.exports = header;
