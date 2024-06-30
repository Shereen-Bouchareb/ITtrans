const sqlite3 = require("sqlite3").verbose();
const Dao = require("./dao");
const ClientDao = require("./clientDao");
const ConfigDao = require("./configDao");

const DATABASE_PATH = "./database.db";

async function main() {
  const db = new sqlite3.Database(DATABASE_PATH);
  const dao = new Dao(db);
  const clientDao = new ClientDao(db);
  const configDao = new ConfigDao(db);

  try {
    dao.createSchema();

    // Insert a client
    await clientDao.insert("Client1", "token1", Date.now() + 10000);
    // Retrieve client by token
    const client = await clientDao.getByToken("token1");
    console.log("Client retrieved:", client);

    // Insert a config entry
    await configDao.insert("timeout", "300");
    // Retrieve value by key
    const value = await configDao.getValueByKey("timeout");
    console.log("Value retrieved:", value);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    // Close database connection
    dao.close();
  }
}

main();
