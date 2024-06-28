const Dao = require('./dao.js')
  
class ConfigDao  extends Dao {

    constructor() {
        super();
    }
    

    insert (key, value) {
        return new Promise((resolve, reject) => {
          db.run(`INSERT INTO config (key, value) VALUES (?, ?)`,
            [key, value], (err) => {
              if (err) {
                console.error(`Error inserting port  ${key}:`, err.message);
                return reject(err);
              } else {
                console.log(`Port ${key} inserted successfully`);
                resolve();
              }
            });
        });
      }

    /**
     * Méthode pour obtenir la valeur d'une clé à partir de la base de données
     * @param {string} key - La clé à rechercher dans la base de données
     * @returns {Promise<any>} - Une Promise qui résout avec la valeur de la clé
     */
    getValueByKey(key) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT value FROM config WHERE key = ?';
            this.db.get(sql, [key], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(row.value);
                } else {
                    reject(new Error('Clé non trouvée'));
                }
            });
        });
    }

}
  
        
module.exports = ConfigDao;