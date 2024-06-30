const Dao = require("./dao");

class ConfigDao extends Dao {
<<<<<<< HEAD
  constructor() {
    super();
=======
  constructor(db) {
    super(db);
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
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
<<<<<<< HEAD
=======
            console.log(`Config entry ${key} inserted successfully`);
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
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

<<<<<<< HEAD
module.exports = ConfigDao;
=======
module.exports = ConfigDao;
>>>>>>> 67654bfe3fc7381b9eae45da3cfcfd11d62a16ba
