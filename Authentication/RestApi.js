const express = require('express');
const jwtDriver = require('../drivers/jwtDriver');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

// Connect to the SQLite database
const db = new sqlite3.Database('users.db');

// HTTP endpoint to handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the user
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If user found, compare passwords using bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // User authenticated successfully, generate JWT
      const payload = { username }; // Add more user details if needed
      const token = jwtDriver.generateToken(payload);

      res.json({ token });
    });
  });
});

// Start the HTTP server
app.listen(3000, () => {
  console.log('HTTP server for login is listening on port 3000');
});
