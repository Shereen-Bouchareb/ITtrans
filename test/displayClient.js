const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9999/ws'); 

ws.on('open', function open() {
    console.log('Connected to server');
    
    const message = {
       "sender": "Display",
       "token" : "Display", 
       "type" : "login",
      "timestamp": Date.now(),
      "content" : {
          "location": { "": "" },
          "position": { "": "", "": "" }
       }
    };

    ws.send(JSON.stringify(message));
    console.log('Message sent');
});

ws.on('message', function message(data) {
    console.log('display connected to the server  :', data.toString());
});

ws.on('close', function close(code, reason) {
    console.log('Connection closed:', code, reason);
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err.message);
});
