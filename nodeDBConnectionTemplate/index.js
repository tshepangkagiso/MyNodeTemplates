const sql = require('mssql/msnodesqlv8');
const connectToDatabase = require('./Database/dBConnect'); 

  
  // Call the function to connect to the database
  let query ='select * from  Clients';
  connectToDatabase(query)
  .then((connectionResult) => {

    if (connectionResult.success)
    {
      console.log('Query Result:', connectionResult.result);
    } 
    else
    {
      console.error('Connection Error:', connectionResult.error);
    }  
  })
  .catch((error) => {
    console.error('Error:', error);
  });