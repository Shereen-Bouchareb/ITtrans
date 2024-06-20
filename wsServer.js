const WebSocket = require('ws');
const authService = require('./service/service');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  const token = req.headers['sec-websocket-protocol'];

  try {
    authService.authenticate(token, (err, client) => {
      if (err) {
        ws.close(1008, 'Invalid token');
        console.error('Connection rejected:', err.message);
        return;
      }

      console.log('Client authenticated:', client);
      ws.send('Authentication successful');

      // Handle WebSocket events here
      ws.on('message', (message) => {
        console.log('Received message:', message);
        // 
      });

      ws.on('close', (code, reason) => {
        console.log('Connection closed:', code, reason);
        // 
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        //
      });
    });
  } catch (error) {
    ws.close(1011, 'Internal server error');
    console.error('Internal server error:', error.message);
  }
});
