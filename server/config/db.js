const mysql = require("mysql2");

// Connection pool is better than createConnection:
// - reuses connections instead of opening/closing each time
// - handles multiple simultaneous requests safely
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,   // max 10 concurrent connections
    queueLimit: 0
});

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("MySQL Connected");
        connection.release();
    }
});

// Export promise-based pool so controllers can use async/await
module.exports = pool.promise();
