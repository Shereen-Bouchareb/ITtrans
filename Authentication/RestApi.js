const express = require('express');
const jwtDriver = require('./driverjwt');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

// Connect to the SQLite database
const db = new sqlite3.Database('users.db');

// HTTP endpoint to handle user login (((/login is the endpoint in the api )))
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the user
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    
    if (!user) {
      console.log(user);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // if user exst, compare passwords 
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Invalid credentials 404' });
      }

      // User authenticated successfully, generate JWT
      const payload = { username }; // we can add some info 
      const token = jwtDriver.generateToken(payload);

      res.json({ token });
    });
  });
});

// Start the HTTP server
app.listen(3000, () => {
  console.log('HTTP server for login is listening on port 3000');
});
