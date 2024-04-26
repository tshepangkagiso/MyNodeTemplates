const sql = require('mssql/msnodesqlv8');

//database configuration
const config = {
    //user:,
    //password:,
    database: 'SampleDB',
    server: '(localdb)\\MSSQLLocalDB',
    driver: 'msnodesqlv8',
    options:{
        trustedConnection:true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    }
};

//connect to database
async function connectToDatabase(sqlQuery) {
  try 
  {
      await sql.connect(config);
      console.log('Connected to SQL Server');

      // Create a new request object
      const request = new sql.Request();

      // Execute the SQL query
      const result = await request.query(sqlQuery);

      // Close the connection
      sql.close();

      // Return a successful connection (true) and the query result object
      return { success: true, result: result.recordset };
  } 
  catch (err) 
  {
      console.error('Error connecting to SQL Server:', err);
      // Return a failed connection (false) and an error message
      return { success: false, error: err.message };
  }
  }
  
  module.exports = connectToDatabase;




