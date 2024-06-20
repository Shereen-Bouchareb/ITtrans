const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080', {
  headers: {
    'Sec-WebSocket-Protocol': 'Pt@1'
  }
});

ws.on('open', () => {
  console.log('Connected to server');
});

ws.on('message', (data) => {
  console.log('Received:', data);
});

ws.on('close', (code, reason) => {
  console.log('Connection closed:', code, reason);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});
