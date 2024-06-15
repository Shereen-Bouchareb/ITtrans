const jwtDriver = require('./driverjwt');

exports.authenticate = (token, secretKey) => {
  try {
    const decoded = jwtDriver.verifyToken(token, secretKey); // Pass the secret key to the JWT driver
    return decoded;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};
