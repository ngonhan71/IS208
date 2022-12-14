const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306
});

pool.getConnection((err, conn) => {
    if(err) return console.log(err)
    console.log("MySQL - Connected successfully")
    pool.releaseConnection(conn);
})

module.exports = pool.promise()