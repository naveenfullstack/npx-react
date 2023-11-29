const requestIp = require('request-ip');

const authIp = function(req, res, next) {
    const clientIp = requestIp.getClientIp(req);
    const allowedIps = ['::1'];
    if (allowedIps.includes(clientIp)) {
        next();
      } else {
        res.status(401).send('Unautherized Access please try again later with access')
      }
    
      next();
  };

  module.exports = authIp;
  