const sql = require('mssql/msnodesqlv8');

// Database configuration
const config = {
  database: 'BusinessModel',
  server: '(localdb)\\MSSQLLocalDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  },
  pool: {
    max: 20,             // Maximum number of connections in the pool when maxed it queues requsts
    min: 5,              // Minimum number of connections in the pool even if idle
    idleTimeoutMillis: 30000, // How long a connection can be idle (in milliseconds) before being released 30s
  }
};

// Function to connect to the database
async function connectToDB() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

// Function to close the database connection
async function closeDB() {
  try {
    await sql.close();
    console.log('Closed database connection');
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
}

module.exports = {
  connectToDB,
  closeDB
}