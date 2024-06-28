console.log('Starting WebSocket server .');

const WebSocket = require('ws');
const { ConfigDao } = require('../dao/ConfigDao.js');
const { LogDao } = require('../dao/LogDao.js');
const { ClientDao } = require('../dao/ClientDao.js');

const configDao = new ConfigDao();
const logDao = new LogDao();
const clientDao = new ClientDao();

const clients = new Map();

configDao.getValueByKey('wsServerPort')
    
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
            // ws.send('to client: Connection successful');

            ws.on('message', async (message) => {
                
                // To Do
                // add the dao.log 
                
                try {
                    const messageJsonObject = parse(message); 

                    const client = await getAuthorizedClient(messageJsonObject.token, messageJsonObject.type);
                   // store the ws connection in  the map 
                   clients.set(client.name , ws);

                    handleMessage(messageJsonObject);
                    
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


function parse(message) {
        
        try {
            const parsedMessage = JSON.parse(message);
            const requiredFields = ['token', 'type', 'timestamp', 'content'];

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
   

    function getAuthorizedClient(token, messageType) {
        
    
        return clientDao.getByToken(token)
            .then(client => {
                //token invalid 
                if (!client) {
                    throw new Error('Invalid token');
                }
                // token expired 
                if (Date.now() > client.expired_at) {
                    throw new Error('Token expired');
                }
                if (!isTokenCompatible(client.name, messageType)) {
                    throw new Error('Token not compatible with message type');
                }
                return client;
            });
    }
    function isTokenCompatible(clientName, messageType) {
        const compatibility = { 
            'Tablet': [MESSAGE_TYPE_DRIVING],
            'Location': [MESSAGE_TYPE_LOCATION],
            'Payment': [], 
            'Display': [MESSAGE_TYPE_DISPLAY]
        };
    
        return compatibility[clientName] && compatibility[clientName].includes(messageType);
    }

    // handling the message 
const MESSAGE_TYPE_LOCATION = 'location';
const MESSAGE_TYPE_DRIVING = 'driving';
// const MESSAGE_TYPE_DISPLAY = 'connection';
const POSITION_STATION = 'station';
const POSITION_INTERSTATION = 'interstation';
const CLIENT_TABLET = 'tablet';
const CLIENT_DISPLAY = 'display';
const CLIENT_PAYMENT = 'payment';
const CLIENT_LOCATION = 'location'; 
const DRIVING_TYPE_CALIBRATE = 'calibrate';
const DRIVING_TYPE_START = 'start';
const DRIVING_TYPE_FINISH = 'finish';

function handleMessage(message) {

    switch (message.type) {
        case MESSAGE_TYPE_LOCATION:
            handleLocationMessage(message);
            break;
        case MESSAGE_TYPE_DRIVING:
            handleDrivingMessage(message);
            break;
            // case MESSAGE_TYPE_DISPLAY: 
            // handleDisplayMessage(message);
            // break; 
        default:
            handleUnknownMessage(message);
    }
}

function handleLocationMessage(message) {

    const content = message.content;

    if (content.position.type === POSITION_STATION) {
        sendMessage(MESSAGE_TYPE_LOCATION, content, [CLIENT_DISPLAY, CLIENT_TABLET]);
        console.log('handling geolocation msg (station)+ sending data to display and tablet');
    } else if (content.position.type === POSITION_INTERSTATION) {
        sendMessage(MESSAGE_TYPE_LOCATION, content, [CLIENT_DISPLAY,CLIENT_TABLET]);
        console.log('handling geolocation  msg(interstation) + sending data to tablet ');
    }

    requestLocation(message);
}

const REQUEST_ROUTE_LOCATION = "dynamics/bus" ; 

const  requestLocation = async (message) => {
    
    const msServerIp = await configDao.getValueByKey('msServerIp');
    const msServerPort = await configDao.getValueByKey('msServerPort');     
    const msServerProtocol = await configDao.getValueByKey('msServerProtocol');  
    const busNumber = await configDao.getValueByKey('busNumber'); 

    const url = msServerProtocol + "://" + msServerIp + ":" + msServerPort + "/" + REQUEST_ROUTE_LOCATION + "/" +busNumber;
    
    // TO DO request to the backend . 
    
  
}


function handleDrivingMessage(message) {

    const content = message.content;

    if ([DRIVING_TYPE_CALIBRATE, DRIVING_TYPE_START, DRIVING_TYPE_FINISH].includes(content.driving_type)) {
        sendMessage(MESSAGE_TYPE_DRIVING, content, [CLIENT_LOCATION,CLIENT_DISPLAY]);
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

function sendMessage(type, content, receivers) {
    
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
