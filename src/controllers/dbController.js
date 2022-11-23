const mysql = require('mysql2/promise');
const config = require('../config/config');

async function query(sqlStatement) {
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sqlStatement);

    return results
}

module.exports = {
    query
}

