console.log('Starting WebSocket server...');

const WebSocket = require('ws');
const authService = require('./service/service');

const serverPort = D ;
const wss = new WebSocket.Server({  port :serverPort});
console.log('WebSocket server created on port 8081');

wss.on('connection', (ws, req) => {

console.log ('the url of the connection : ' , rep.url);


  if (req.url !== '/ws') {  // Check the URL path
    ws.close(1008, 'Invalid URL path');
    console.error('Connection rejected: Invalid URL path');
    return;
  }

  console.log('New connection established');
  const token = req.headers['sec-websocket-protocol'];
  console.log('Received token:', token);

  if (!token) {
    ws.close(1008, 'Token is missing');
    console.error('Connection rejected: Token is missing');
    return;
  }

  try {
    authService.authenticate(token, (err, client) => {
      console.log('Authenticating token');
      if (err) {
        ws.close(1008, 'Invalid token');
        console.error('Connection rejected:', err.message);
        return;
      }

      console.log('Client authenticated:', client);
      ws.send('Authentication successful');

      ws.on('message', (message) => {
        console.log('Received message:', message);
      });

      ws.on('close', (code, reason) => {
        console.log('Connection closed:', code, reason);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
      });
    });
  } catch (error) {
    ws.close(1011, 'Internal server error');
    console.error('Internal server error:', error.message);
  }
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error.message);
});
