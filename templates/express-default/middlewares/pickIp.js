const axios = require('axios');

const pickIp = async (req, res, next) => {
  try {
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const ipAddress = ipResponse.data.ip;

    const ipDetailsResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const ipDetails = ipDetailsResponse.data;

    console.log({ipAddress});
    console.log('IP Details:', ipDetails);

    req.ipAddress = ipAddress;
    req.ipDetails = ipDetails;

    next();
  } catch (error) {
    console.error('Error retrieving IP address:', error);
    next();
  }
};

module.exports = pickIp;
  