const dbDriver = require('../driver/driver');

exports.authenticate = (token, callback) => {
  dbDriver.getClientByToken(token, (err, client) => {
    if (err || !client) {
      return callback(new Error('Invalid token'));
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (client.expiresAt < currentTime) {
      return callback(new Error('Token expired'));
    }

    callback(null, client);
  });
};