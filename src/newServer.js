console.log('Starting WebSocket server .');

const WebSocket = require('ws');
const Dao = require('./dao/dao');

const dao = new Dao();
const clients = new Map();
dao.getValueByKey('serverPort')
    .then(serverPort => {
        const wss = new WebSocket.Server({ port: serverPort });
        console.log(`Server created on port : ${serverPort}`);

        wss.on('connection', (ws, req) => {
            console.log('Received connection request for URL:', req.url);

            if (req.url !== '/ws') { // Check the URL path
                ws.close(1008, 'Invalid URL path');
                console.error('Connection rejected: Invalid URL path');
                return;
            }
            console.log('New connection established');
            ws.send('establishing connection');

            ws.on('message', async (message) => {
                try {
                    const parsedMessage = checkMessage(message);
                   const client = await handleToken(parsedMessage.token, parsedMessage.type);
                   // store the ws connection in  the map 
                   clients.set(client.clientName , ws);

                    handleMessage(parsedMessage);
                    
                } catch (err) {
                    ws.close(1008, err.message);
                    console.error('Connection rejected:', err.message);
                }
            });
            ws.on('close', (code, reason) => {
                console.log('Connection closed:', code, reason);
              // removing client from the map wheen the cnx is closed 
               for (let [key , clientWs] of clients.entries()){
                 if (clientWs===ws){
                 clients.delete(key);
                 break;

                 }
              }



            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error.message);
               
            });
        });
    })
    .catch(err => {
        console.error('Erreur:', err.message);
    });


    function checkMessage(message) {
        try {
            const parsedMessage = JSON.parse(message);
            const requiredFields = ['sender', 'token', 'type', 'timestamp', 'content'];
            for (const field of requiredFields) {
                if (!parsedMessage.hasOwnProperty(field)) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            return parsedMessage;
        } catch (err) {
            throw new Error('Invalid message format');
        }
    }
   

    function handleToken(token, messageType) {
        //token missing 
        if (!token) {
            throw new Error('Token is missing');
        }
    
        return dao.getClientByToken(token)
            .then(client => {
                //token invalid 
                if (!client) {
                    throw new Error('Invalid token');
                }
                // token expired 
                if (Date.now() > client.expiredAt) {
                    throw new Error('Token expired');
                }
                if (!isTokenCompatible(client.clientName, messageType)) {
                    throw new Error('Token not compatible with message type');
                }
                return client;
            });
    }
    function isTokenCompatible(clientName, messageType) {
        const compatibility = {
            'Tablet': ['driving'],
            'Geolocation': ['geolocation'],
            'PaymentTerminal': [], 
            'Display': ['login']
        };
    
        return compatibility[clientName] && compatibility[clientName].includes(messageType);
    }

    // handling the message 
const MESSAGE_TYPE_GEOLOCATION = 'geolocation';
const MESSAGE_TYPE_DRIVING = 'driving';
const MESSAGE_TYPE_DISPLAY = 'login';
const POSITION_STATION = 'station';
const POSITION_INTERSTATION = 'interstation';
const CLIENT_TABLET = 'Tablet';
const CLIENT_DISPLAY = 'Display';
const CLIENT_PAYMENT_TERMINAL = 'PaymentTerminal';
const CLIENT_GEOLOCATION = 'Geolocation';
const DRIVING_TYPE_CALIBRATE = 'calibrate';
const DRIVING_TYPE_START = 'start';
const DRIVING_TYPE_FINISH = 'finish';
const DRIVING_TYPE_INITIATE  = 'INITIATE';

function handleMessage(message) {
    switch (message.type) {
        case MESSAGE_TYPE_GEOLOCATION:
            handleGeolocationMessage(message);
            break;
        case MESSAGE_TYPE_DRIVING:
            handleDrivingMessage(message);
            break;
            case MESSAGE_TYPE_DISPLAY: 
            handleDisplayMessage(message);
            break; 
        default:
            handleUnknownMessage(message);
    }
}

function handleGeolocationMessage(message) {
    const content = message.content;
    if (content.position.type === POSITION_STATION) {
        sendMessage(MESSAGE_TYPE_GEOLOCATION, content, [CLIENT_DISPLAY, CLIENT_TABLET]);
       console.log('handling geolocation msg (station)+ sending data to display and tablet');
    } else if (content.position.type === POSITION_INTERSTATION) {
        sendMessage(MESSAGE_TYPE_GEOLOCATION, content, [CLIENT_TABLET]);
        console.log('handling geolocation  msg(interstation) + sending data to tablet ');
    }
    
}

function handleDrivingMessage(message) {
    const content = message.content;
    if ([DRIVING_TYPE_CALIBRATE, DRIVING_TYPE_START, DRIVING_TYPE_FINISH , DRIVING_TYPE_INITIATE] .includes(content.driving_type)) {
        sendMessage(MESSAGE_TYPE_DRIVING, content, [CLIENT_DISPLAY]);
      console.log('handling tablet msg');
    }
}

function handleDisplayMessage(message) {
      console.log('handling display msg');
}
function handleUnknownMessage(message) {
    console.error('Unknown message type:', message.type);
}

//the sending TODO

function sendMessage(type , content , receivers){
     const message = {
             type: type,
             content: content,
             timestamp: Date.now()
              };
    receivers.forEach(receiver => {
        const clientWs = clients.get(receiver);
        if(clientWs){
            clientWs.send(JSON.stringify(message));
        }
        
    });




   }
