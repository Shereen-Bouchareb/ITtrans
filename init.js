const Dao = require("./daos/dao");
const ClientDao = require('./daos/clientDao');
const ConfigDao = require('./daos/configDao');


async function main() {
  const dao = new Dao();
    const clientDao = new ClientDao();
    const configDao = new ConfigDao();

  try {
    dao.createSchema();
      
    const clients = [
        { name: 'tablet', token: '12345', expired_at: Date.now() + 8640000000 }, // expires in 100 day
        { name: 'location', token: '12345', expired_at: Date.now() + 8640000000 },
        { name: 'payment', token: '12345', expired_at: Date.now() + 8640000000 },
        { name: 'display', token: '12345', expired_at: Date.now() + 8640000000 }
       
    ];
    const config = [
        { key: 'msServerPort', value: '8080' },
        { key: 'msServerIp', value: '41.111.178.14' },
        { key: 'msServerProtocol', value: 'http' },
        { key: 'busNumber', value: '1234' } ,
        { key: 'wsServerPort', value: '9999' } ,
      ]; 
    // Insert a client
    for (const client of clients) {
        await clientDao.insert(client.name, client.token, client.expired_at);
      }
      
      for (const c of config) {
        await configDao.insert(c.key, c.value);
    }
    // Retrieve client by token
    // const client = await clientDao.getByToken("token1");
    // console.log("Client retrieved:", client);

    // // Insert a config entry
    // await configDao.insert("timeout", "300");
    // // Retrieve value by key
    // const value = await configDao.getValueByKey("timeout");
    // console.log("Value retrieved:", value);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    // Close database connection
    dao.close();
  }
}

main();