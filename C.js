console.log('starting ...');

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8081/ws');

console.log('sending rqst successfully  ...');

ws.on('open', () => {
  console.log('Connected to server');
  ws.send('Hello Server!');
});

ws.on('message', (data) => {
  console.log('Received:', data);
});

ws.on('error', (error) => {
  console.log('error');
  console.error('WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
  console.log('Connection closed:', code, reason);
});
