// forraouf to test , this is the code of the gps that send data to the server each 2 seconds 
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9999/ws');

const geolocationData = [
    { lat: 40.7128, long: -74.0060 },
    { lat: 40.7138, long: -74.0050 },
    { lat: 40.7148, long: -74.0040 },
    // Add more geolocation points as needed
];

let currentIndex = 0;

ws.on('open', function open() {
    console.log('Connected to server');
    
    setInterval(() => {
        if (currentIndex >= geolocationData.length) {
            currentIndex = 0; // Loop through the array
        }

        const message = {
            "sender": "Geolocation",
            "token" : "Geolocation", 
            "type" : "geolocation",
            "timestamp": Date.now(),
            "content" : {
                "location": geolocationData[currentIndex],
                "position": { "type": "interstation", "name": "Station 1" }
            }
        };

        ws.send(JSON.stringify(message));
        console.log('Message sent:', message);

        currentIndex++;
    }, 2000); // Send message every 2 seconds
});

ws.on('message', function message(data) {
    console.log('Received:', data.toString());
});

ws.on('close', function close(code, reason) {
    console.log('Connection closed:', code, reason);
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err.message);
});
