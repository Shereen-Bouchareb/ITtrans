const Dao = require("./dao");

class ClientDao extends Dao {
<<<<<<< HEAD
  constructor() {
    super();
  }

  insert(name, token, expired_at) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO clients (name, token, expired_at) VALUES (?, ?, ?)`,
        [name, token, expired_at],
=======
  constructor(db) {
    super(db);
  }

  insert(name, token, expiredAt) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO clients (name, token, expired_at) VALUES (?, ?, ?)`,
        [name, token, expiredAt],
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
        (err) => {
          if (err) {
            console.error(`Error inserting client ${name}:`, err.message);
            reject(err);
          } else {
<<<<<<< HEAD
=======
            console.log(`Client ${name} inserted successfully`);
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
            resolve();
          }
        }
      );
    });
  }

  getByToken(token) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM clients WHERE token = ?";
      this.db.get(sql, [token], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve({
            id: row.id,
            name: row.name,
            token: row.token,
            expiredAt: row.expired_at,
          });
        } else {
          reject(new Error("Client not found"));
        }
      });
    });
  }
}

<<<<<<< HEAD

module.exports = ClientDao;
=======
module.exports = ClientDao;
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
