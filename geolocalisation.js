const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9999/ws'); 

ws.on('open', function open() {
    console.log('Connected to server');
    
    const message = {
        "sender": "Geolocation",
        "token" : "Geolocation", 
        "type" : "geolocation",
        "timestamp": Date.now(),
        "content" : {
            "location": { "lat": 40.7128, "long": -74.0060 },
            "position": { "type": "interstation", "name": "Station 1" }
        }
    };

    ws.send(JSON.stringify(message));
    console.log('Message sent');
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

