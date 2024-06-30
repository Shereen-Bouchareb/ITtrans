const Dao = require('./dao');
  
class LogDao extends Dao {
    
    constructor() {
        super();
    }
     
    insert(message,sender,receiver,received_at) {
        return new Promise((resolve, reject) => {
            this.db.run(
              `INSERT INTO config (message,sender,receiver,received_at) VALUES (?,?,?,?)`,
              [message,sender,receiver,received_at],
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
}

module.exports = LogDao;