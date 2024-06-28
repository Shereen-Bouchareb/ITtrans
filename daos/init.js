const ClientDao = require('./clientDao');

async function main() {
    const clientDao = new ClientDao();
    clientDao.createSchema();

    try {
        await clientDao.insert('Client1', 'token1', Date.now() + 10000);
        const client = await clientDao.getByToken('token1');
        console.log('Client retrieved:', client);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        clientDao.close();
    }
}

main();
