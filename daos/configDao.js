const Dao = require("./dao");

class ConfigDao extends Dao {
  constructor() {
    super();
  }

  insert(key, value) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO config (key, value) VALUES (?, ?)`,
        [key, value],
        (err) => {
          if (err) {
            console.error(`Error inserting config entry ${key}:`, err.message);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  getValueByKey(key) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT value FROM config WHERE key = ?";
      this.db.get(sql, [key], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row.value);
        } else {
          reject(new Error("Key not found"));
        }
      });
    });
  }
}

module.exports = ConfigDao;