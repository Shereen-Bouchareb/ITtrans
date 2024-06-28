const sqlite3 = require("sqlite3").verbose();

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
            )`);

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
