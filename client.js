const WebSocket = require('ws');
const fetch = require('node-fetch');

// Replace with your actual login endpoint and credentials
const loginEndpoint = 'http://localhost:3000/login';
const username = 'user1';
const password = 'p123';

async function loginAndConnect() {
  try {
    // Step 1: Log in and obtain the token
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Login failed:', data.message);
      return;
    }

    const token = data.token;
    console.log('Obtained token:', token);

    // Step 2: Use the token to authenticate the WebSocket connection
    const ws = new WebSocket('ws://localhost:8080', token);

    ws.on('open', () => {
      console.log('Connected to server');

      // Send a test message
      const message = JSON.stringify({ latitude: 40.7128, longitude: -74.0060 }); // Example coordinates
      ws.send(message);
    });

    ws.on('message', (data) => {
      console.log('Received from server:', data.toString());
    });

    ws.on('close', () => {
      console.log('Disconnected from server');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

  } catch (error) {
    console.error('Error logging in or connecting to WebSocket:', error);
  }
}

// Run the function
loginAndConnect();
