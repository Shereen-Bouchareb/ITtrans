


class Dao {

    const sqlite3 = require('sqlite3').verbose();

    const db = new sqlite3.Database('clients.db');


    getServerPort(){
        exports.getPortByKey = ('server_port', callback) => {
            db.get('SELECT * FROM config WHERE key = ?', [key], (err, row) => {
              callback(err, row);
            });
          };
        return row['server_port'];
    }

   

}
