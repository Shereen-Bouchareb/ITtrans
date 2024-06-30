const Dao = require("./daos/dao");
const ClientDao = require('./daos/clientDao');
const ConfigDao = require('./daos/configDao');


async function main() {

  const dao = new Dao();
  const clientDao = new ClientDao();
  const configDao = new ConfigDao();

  async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  try {
    await dao.createSchema();
    await delay(100);

    const clients = [
      { name: 'tablet', token: '12345', expired_at: Date.now() + 8640000000 }, // expires in 100 day
      { name: 'location', token: '1234', expired_at: Date.now() + 8640000000 },
      { name: 'payment', token: '123', expired_at: Date.now() + 8640000000 },
      { name: 'display', token: '134', expired_at: Date.now() + 8640000000 }

    ];
    const config = [
      { key: 'msServerPort', value: '8080' },
      { key: 'msServerIp', value: '41.111.178.14' },
      { key: 'msServerProtocol', value: 'http' },
      { key: 'busNumber', value: '1234' },
      { key: 'wsServerPort', value: '9999' },
    ];


    for (const client of clients) {
      await clientDao.insert(client.name, client.token, client.expired_at);
    }

    for (const c of config) {
      await configDao.insert(c.key, c.value);
    }

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    clientDao.close();
    configDao.close()
    dao.close();

  }

}
module.exports = main; 