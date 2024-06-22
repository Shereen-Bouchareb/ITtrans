console.log('Starting WebSocket server...');

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8081 });
console.log('WebSocket server created on port 8081');

server.on('connection', (ws, req) => {
  console.log('Received connection request for URL:', req.url);
  
if (req.url !== '/ws'){
ws.close(1008, 'Invalid url path');
console.error('connection rejected : Invalid URL path');
return ; 
}
console.log('new connection is established with the C');

  ws.send('Connection successful');
  
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

server.on('error', (error) => {
  console.error('WebSocket server error:', error.message);
});

