const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // Define the users to be added
  const users = [
    { username: 'user1', password: 'p123' },
    { username: 'user2', password: 'p456' },
    { username: 'user3', password: 'p789' }
  ];

  // Function to insert a user
  const insertUser = (username, password) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) throw err;
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], (err) => {
        if (err) {
          console.error(`Error inserting user ${username}:`, err.message);
        } else {
          console.log(`User ${username} inserted successfully`);
        }
      });
    });
  };

  // Insert each user
  users.forEach(user => insertUser(user.username, user.password));

  // Close the database connection after all insertions are complete
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Database connection closed');
  });
});
