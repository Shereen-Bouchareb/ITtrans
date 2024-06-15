require('dotenv').config();    // Load environment variables from .env file

const WebSocket = require('ws');
const authController = require('./Authentication/control');

// Retrieve secret key from environment variable
const secretKey = process.env.JWT_SECRET_KEY;

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  // Pass the secret key to the authentication controller
  authController.handleConnection(ws, req, secretKey);
});

console.log('WebSocket server is listening on port 8080');