
const sqlite3 = require('sqlite3').verbose();

class Dao {
    constructor() {
        this.db = new sqlite3.Database('dao/database.db');
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

    /**
     * Méthode pour obtenir les informations d'un client à partir de son token
     * @param {string} token - Le token du client à rechercher
     * @returns {Promise<object>} - Une Promise qui résout avec les informations du client
     */
    getClientByToken(token) {
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

module.exports = Dao;
