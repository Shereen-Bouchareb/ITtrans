// client.js

// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:9999/ws');

// Handle connection open event
ws.onopen = function() {
    console.log('Connected to server');
};

// Handle message received from server
ws.onmessage = function(event) {
    console.log('Received data from server:', event.data);
    // Process incoming messages here
};

// Handle connection close event
ws.onclose = function(event) {
    console.log('Connection closed:', event.code, event.reason);
};

// Handle WebSocket error
ws.onerror = function(error) {
    console.error('WebSocket error:', error.message);
};

// Function to send a message to the server
function sendMessage(message) {
    ws.send(JSON.stringify(message));
    console.log('Message sent:', message);
}

// Example usage: sendMessage(yourMessageObject);
