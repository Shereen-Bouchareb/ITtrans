const sqlite3 = require("sqlite3").verbose();

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
            )`);
    });
  }

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


