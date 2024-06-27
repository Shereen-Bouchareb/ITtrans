const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../dao/database');

exports.getClientByToken = (token, callback) => {
  db.get('SELECT * FROM clients WHERE token = ?', [token], (err, row) => {
    callback(err, row);
  });
};

exports.addClient = (clientName, token, expiredAt, callback) => {
  db.run('INSERT INTO clients (clientName, token, expiredAt) VALUES (?, ?, ?)', [clientName, token, expiredAt], callback);
};

exports.getPortByKey = (key, callback) => {
  db.get('SELECT * FROM config WHERE key = ?', [key], (err, row) => {
    callback(err, row);
  });
};

exports.addPort = (key, value, callback) => {
  db.run('INSERT INTO config (key, value) VALUES (?, ?)', [key, value], callback);
};