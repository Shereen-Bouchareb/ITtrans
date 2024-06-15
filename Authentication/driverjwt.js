const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

exports.generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { algorithm: 'HS256' });
};

exports.verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};