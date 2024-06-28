const Dao = require('./dao');
  
class LogDao extends Dao {
    
    constructor() {
        super();
    }
     
    insert(message,sender,receiver,received_at) {
        return new Promise((resolve, reject) => {
            this.db.run(
              `INSERT INTO config (key, value) VALUES (?, ?)`,
              [message,sender,receiver,received_at],
              (err) => {
                if (err) {
                  console.error(`Error inserting config entry ${key}:`, err.message);
                  reject(err);
                } else {
                  console.log(`Config entry ${key} inserted successfully`);
                  resolve();
                }
              }
            );
          });
    }
}

module.exports = LogDao;