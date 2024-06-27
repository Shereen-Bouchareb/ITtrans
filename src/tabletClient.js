const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9999/ws'); 

ws.on('open', function open() {
    console.log('Connected to server');
    
    const message = {
        "sender": "Tablet",
        "token" : "Tablet", 
        "type" : "driving",
        "timestamp": Date.now(),
        "content" : {
            "driving_type": "calibrate", 
            "position": { "type": "station", "name": "Station 1" }
        }
    };

    ws.send(JSON.stringify(message));
    console.log('Message sent');
});

ws.on('message', function message(data) {
    console.log('Received data form gps :', data.toString());
});

ws.on('close', function close(code, reason) {
    console.log('Connection closed:', code, reason);
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err.message);
});
