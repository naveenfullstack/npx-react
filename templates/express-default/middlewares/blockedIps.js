const axios = require('axios');
const ipResponse = await axios.get('https://api.ipify.org?format=json');
const ipAddress = ipResponse.data.ip;

const blockedIps = function(req, res, next) {
    const clientIp = ipAddress(req);
    const blockedIp = ['125','::ffff:127.0.0.1'];
    if (blockedIp.includes(clientIp)) {
        res.status(401).send('Unautherized Access please try again later with access')
      } else {
        next();
      }
    
      next();
  };

  module.exports = blockedIps;
  