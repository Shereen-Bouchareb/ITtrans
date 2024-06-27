function logMessage(message) {
    const log = document.getElementById('log');
    log.innerHTML = `<div class="log-entry">${message}</div><hr class="log-divider">`;
}

function sendMessage() {
    const serverUrl = document.getElementById('serverUrl').value;
    const jsonMessage = document.getElementById('jsonMessage').value;

    if (!serverUrl) {
        logMessage('WebSocket server URL is required.');
        return;
    }

    try {
        const parsedMessage = JSON.parse(jsonMessage); // Validate JSON format

        if (!parsedMessage.sender || !parsedMessage.token || !parsedMessage.type || !parsedMessage.timestamp || !parsedMessage.content) {
            logMessage('Invalid JSON content');
            return;
        }
        
    } catch (e) {
        logMessage('Invalid JSON format');
        return;
    }

    try {
        const ws = new WebSocket(serverUrl);

        ws.onopen = function() {
            logMessage('Connected to server');
            ws.send(jsonMessage);
          //  logMessage('Message sent: ' + jsonMessage);
        };

        ws.onmessage = function() {
            logMessage('Received data from server: "establishing connection" ' );
        };

        ws.onclose = function(event) {
            logMessage('Connection closed: ' + event.code + ' ' + event.reason);

            
            document.getElementById('serverUrl').disabled = false;
            document.getElementById('jsonMessage').disabled = false;
        };

        ws.onerror = function(error) {
            logMessage('WebSocket error: ' + error.message);
        };
    } catch (error) {
        logMessage('WebSocket connection failed: ' + error.message);
    }
}
