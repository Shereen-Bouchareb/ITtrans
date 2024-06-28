const Dao = require('./dao.js');

console.log(Dao)

class ClientDao  extends Dao  {

    constructor() {
        super();

    }


     insert(name, token, expiredAt) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO clients (name, token, expired_at) VALUES (?, ?, ?)`,
            [name, token, expiredAt], (err) => {
                if (err) {
                console.error(`Error inserting client ${name}:`, err.message);
                return reject(err);
                } else {
                console.log(`Client ${name} inserted successfully`);
                resolve();
                }
            });
        });
        }
   
    /**
     * Méthode pour obtenir les informations d'un client à partir de son token
     * @param {string} token - Le token du client à rechercher
     * @returns {Promise<object>} - Une Promise qui résout avec les informations du client
     */
    getByToken(token) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM clients WHERE token = ?';
            this.db.get(sql, [token], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({
                        id: row.id,
                        clientName: row.clientName,
                        token: row.token,
                        expiredAt: row.expiredAt
                    });
                } else {
                    reject(new Error('Client non trouvé'));
                }
            });
        });
    } 
}

module.exports = ClientDao;