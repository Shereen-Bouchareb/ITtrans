const sqlite3 = require('sqlite3').verbose();
const ClientDao = require('./clientDao.js');
const ConfigDao = require('./configDao.js');

const DATABASE_PATH = './database.db';

class Dao {
    constructor() {
        this.db = new sqlite3.Database(DATABASE_PATH);
    }

    createSchema() {
        this.db.serialize(() => {
            // Table des clients
            this.db.run(`CREATE TABLE IF NOT EXISTS clients (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              token TEXT UNIQUE NOT NULL,
              expired_at INTEGER NOT NULL
            )`);

            // Table des ports
            this.db.run(`CREATE TABLE IF NOT EXISTS config (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              key TEXT UNIQUE NOT NULL,
              value TEXT NOT NULL
            )`);

            this.db.run(`CREATE TABLE IF NOT EXISTS log (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               message TEXT NOT NULL,
               sender TEXT NOT NULL,
               receiver TEXT NOT NULL,
               created_at INTEGER NOT NULL
            )`);
        });
    }

    async insertData(clients, config) {
        const clientDao = new ClientDao(this.db);
        const configDao = new ConfigDao(this.db);

        try {
            for (const client of clients) {
                await clientDao.insert(client.clientName, client.token, client.expiredAt);
            }

            for (const c of config) {
                await configDao.insert(c.key, c.value);
            }

        } catch (err) {
            console.error('Error during insertion:', err.message);
        } finally {
            // Close the database connection after all insertions
            this.db.close((err) => {
                if (err) {
                    return console.error('Error closing the database:', err.message);
                }
                console.log('Database connection closed');
            });
        }
    }
}

module.exports = Dao;