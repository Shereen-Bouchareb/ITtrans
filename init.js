const sqlite3 = require('sqlite3').verbose();

// Créer ou ouvrir la base de données SQLite
const db = new sqlite3.Database('clients.db');

// Initialiser la base de données avec des tables pour les clients et les ports
db.serialize(() => {
  // Table des clients
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiresAt INTEGER NOT NULL
  )`);

  // Table des ports
  db.run(`CREATE TABLE IF NOT EXISTS ports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portKey TEXT UNIQUE NOT NULL,
    value INTEGER NOT NULL
  )`);

  // Définir les clients à ajouter
  const clients = [
    { clientName: 'tablette1', token: 'Pt@1', expiresAt: Date.now() + 86400000 }, // expires in 1 day
    { clientName: 'gps1', token: 'Pt@2', expiresAt: Date.now() + 86400000 }
  ];

  // Définir les ports à ajouter
  const ports = [
    { portKey: 'server', value: 8081 }
  ];

  // Fonction pour insérer un client
  const insertClient = (clientName, token, expiresAt) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO clients (clientName, token, expiresAt) VALUES (?, ?, ?)`,
        [clientName, token, expiresAt], (err) => {
          if (err) {
            console.error(`Error inserting client ${clientName}:`, err.message);
            return reject(err);
          } else {
            console.log(`Client ${clientName} inserted successfully`);
            resolve();
          }
        });
    });
  };

  // Fonction pour insérer un port
  const insertPort = (portKey, value) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO ports (portKey, value) VALUES (?, ?)`,
        [portKey, value], (err) => {
          if (err) {
            console.error(`Error inserting port  ${portKey}:`, err.message);
            return reject(err);
          } else {
            console.log(`Port ${portKey} inserted successfully`);
            resolve();
          }
        });
    });
  };

  // Insérer chaque client et chaque port
  const insertData = async () => {
    try {
      for (const client of clients) {
        await insertClient(client.clientName, client.token, client.expiresAt);
      }

      for (const port of ports) {
        await insertPort(port.portKey, port.value);
      }
    } catch (err) {
      console.error('Error during insertion:', err.message);
    } finally {
      // Fermer la connexion à la base de données après toutes les insertions
      db.close((err) => {
        if (err) {
          return console.error('Error closing the database:', err.message);
        }
        console.log('Database connection closed');
      });
    }
  };

  insertData();
});
