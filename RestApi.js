//const express = require('express');
//const bodyParser = require('body-parser');
//const dbDriver = require('./Driver.driver');

//const app = express();
//app.use(bodyParser.json());

//app.post('/add-client', (req, res) => {
  //const { clientName, token, expiresAt } = req.body;

  //dbDriver.addClient(clientName, token, expiresAt, (err) => {
    //if (err) {
      //return res.status(500).json({ message: 'Internal Server Error' });
    //}
    //res.json({ message: 'Client added successfully', token });
//  });
//});

//app.listen(3000, () => {
  //console.log('API server is listening on port 3000');
//});