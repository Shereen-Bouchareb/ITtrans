const sqlite3 = require("sqlite3").verbose();
<<<<<<< HEAD

const DATABASE_PATH = `${__dirname}/database.db`;


class Dao {

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  createSchema() {
    this.db.serialize(() => {
      this.db.run('DROP TABLE IF EXISTS clients');
      this.db.run(`CREATE TABLE clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                token TEXT  NOT NULL,
                expired_at INTEGER NOT NULL
            )`);
      this.db.run('DROP TABLE IF EXISTS config');
      this.db.run(`CREATE TABLE config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL
            )`);

      this.db.run('DROP TABLE IF EXISTS log');
      this.db.run(`CREATE TABLE log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                sender TEXT NOT NULL,
                receiver TEXT NOT NULL,
                created_at INTEGER NOT NULL
=======

const DATABASE_PATH = "./database.db";

class Dao {
  constructor(dbPath = DATABASE_PATH) {
    this.db = new sqlite3.Database(dbPath);
  }

  createSchema() {
    this.db.serialize(() => {
      // Create clients table if not exists
      this.db.run(`CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expired_at INTEGER NOT NULL
            )`);

      // Create config table if not exists
      this.db.run(`CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
            )`);
    });
  }

<<<<<<< HEAD
  close() {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
      } else {
        // we close the database . 
      }
    });
  }




}




module.exports = Dao;


=======
      // Create log table if not exists
      this.db.run(`CREATE TABLE IF NOT EXISTS log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                sender TEXT NOT NULL,
                receiver TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )`);
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
      } else {
        console.log("Database connection closed");
      }
    });
  }
}

module.exports = Dao;
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
