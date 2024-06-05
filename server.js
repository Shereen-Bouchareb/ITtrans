const WebSocket = require('ws');

const app = require('./app');
// instance express pour gerer les requette http .
const db = require ('./modules/load_database'); // le fichier JS(not json)

// creation du serveur webSocket et l'associe au serveur http dans le meme port 

const wss = new WebSocket.Server( {server : app.listen(8080) } );


let mp3PlayerClient = null;


// middlewares
wss.on('connection' , (Socket) => { 
  Socket.on('message' , (data)=> {
// data with type JSON String 
const { latitude , longitude} = JSON.parse(data);

const station = db.findStation(latitude , longitude);

if (station){
  if (mp3PlayerClient){
mp3PlayerClient.send(station.name);
  }

}else{
// station == undefined (null)
console.log("station is not founded ");
}

  });

  if (Socket.upgradeReq.url === '/mp3Player') {
    mp3PlayerClient = Socket;
  }

  // Handle mp3Player client disconnection
  Socket.on('close', () => {
    if (Socket === mp3PlayerClient) {
      mp3PlayerClient = null;
    }
  });

 });

 console.log('Serveur en écoute sur le port 8080');



