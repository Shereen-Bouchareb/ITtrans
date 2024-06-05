const webSocket = require ('ws');


const mp3PlayerClient = new WebSocket('ws://localhost:8080/mp3Player');

    mp3PlayerClient.onmessage = (event) => {
        const stationName = event.data;
        //console.log(`Received station name: ${stationName}`);
       
        console.log("playing mp3 of the station ");


      };
      
      // Handle connection errors
      mp3PlayerClient.onerror = (error) => {
        console.error(`WebSocket error: ${error.message}`);
      };

      mp3PlayerClient.onclose = () => {
        console.log('WebSocket connection closed');
      };







