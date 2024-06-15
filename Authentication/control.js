const authService = require('./service');

exports.handleConnection = (ws, req, secretKey) => {
  const token = req.headers['sec-websocket-protocol'];

  try {
    const user = authService.authenticate(token, secretKey); // Pass the secret key to the authentication service
    console.log('User authenticated:', user);
    ws.send('Authentication successful');
  } catch (error) {
    ws.close(1008, 'Invalid token');
    console.error('Connection rejected:', error.message);
  }

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Further message handling logic...
  });
};
