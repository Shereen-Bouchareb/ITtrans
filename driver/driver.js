const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('clients.db');

exports.getClientByToken = (token, callback) => {
  db.get('SELECT * FROM clients WHERE token = ?', [token], (err, row) => {
    callback(err, row);
  });
};

exports.addClient = (clientName, token, expiresAt, callback) => {
  db.run('INSERT INTO clients (clientName, token, expiresAt) VALUES (?, ?, ?)', [clientName, token, expiresAt], callback);
};

exports.getPortByKey = (key, callback) => {
  db.get('SELECT * FROM ports WHERE key = ?', [key], (err, row) => {
    callback(err, row);
  });
};

exports.addPort = (key, value, callback) => {
  db.run('INSERT INTO ports (key, value) VALUES (?, ?)', [key, value], callback);
};