const Dao = require("./dao");

class ClientDao extends Dao {
  constructor() {
    super();
  }

  insert(name, token, expired_at) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO clients (name, token, expired_at) VALUES (?, ?, ?)`,
        [name, token, expired_at],
        (err) => {
          if (err) {
            console.error(`Error inserting client ${name}:`, err.message);
            reject(err);
          } else {
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


module.exports = ClientDao;