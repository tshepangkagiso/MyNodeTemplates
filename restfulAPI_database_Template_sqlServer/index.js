'use strict';
const express = require('express'), app = express();
const sql = require('mssql/msnodesqlv8');
const bodyParser = require('body-parser');
const cors = require('cors');

// Database configuration
const config = {
  database: 'SampleDB',
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

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

// Create a new client
app.post('/api/database', async (req, res) => {
    try {
      await connectToDB();
      const { FirstName, LastName, Address, Gender, Age } = req.body;
      const request = new sql.Request();
      const query = `
        INSERT INTO Clients (FirstName, LastName, Address, Gender, Age)
        VALUES (@FirstName, @LastName, @Address, @Gender, @Age)
      `;
      request.input('FirstName', sql.Char(100), FirstName);
      request.input('LastName', sql.Char(100), LastName);
      request.input('Address', sql.VarChar(280), Address);
      request.input('Gender', sql.Char(10), Gender);
      request.input('Age', sql.Int, Age);
      const result = await request.query(query);
      res.json(result.recordset);
    } catch (err) {
      console.error('Error creating client:', err);
      res.status(500).json({ error: 'An error occurred while creating the client' });
    } finally {
      await closeDB();
    }
  });

// Retrieve all clients
app.get('/api/database', async (req, res) => {
  try {
    await connectToDB();
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM Clients');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error retrieving clients:', err);
    res.status(500).json({ error: 'An error occurred while retrieving clients' });
  } finally {
    await closeDB();
  }
});

// Retrieve a client by ID
app.get('/api/database/:id', async (req, res) => {
  try {
    await connectToDB();
    const ID = parseInt(req.params.id);
    const request = new sql.Request();
    request.input('ClientID', sql.Int, ID); // Bind the parameter,treat user input as data not executable code
    const result = await request.query(`SELECT * FROM Clients WHERE ClientID = @ClientID`);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (err) {
    console.error('Error retrieving client:', err);
    res.status(500).json({ error: 'An error occurred while retrieving the client' });
  } finally {
    await closeDB();
  }
});

// Update a client by ID
app.put('/api/database/:id', async (req, res) => {
  try {
    await connectToDB();
    const ID = parseInt(req.params.id);
    const { FirstName, LastName } = req.body;
    const request = new sql.Request();
    const query = `
      UPDATE Clients
      SET FirstName = @FirstName, LastName = @LastName
      WHERE ClientID = @ClientID
    `;
    request.input('ClientID', sql.Int, ID); // Bind the parameter,treat user input as data not executable code
    request.input('FirstName', sql.Char(100), FirstName);
    request.input('LastName', sql.Char(100), LastName);
    const result = await request.query(query);
    res.json({ message: 'Client updated successfully' });
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ error: 'An error occurred while updating the client' });
  } finally {
    await closeDB();
  }
});

// Delete a client by ID
app.delete('/api/database/:id', async (req, res) => {
    try {
        await connectToDB();
        const ID = parseInt(req.params.id);
        const request = new sql.Request();

        // Bind the parameter,treat user input as data not executable code
        request.input('ClientID', sql.Int, ID); 
        //Parameterized query to prevent SQL injection
        const query = `DELETE FROM Clients WHERE ClientID = @ClientID `;
        const result = await request.query(query);
        res.json({ message: 'Client deleted successfully' });
      } catch (err) {
        console.error('Error deleting client:', err);
        res.status(500).json({ error: 'An error occurred while deleting the client' });
      } finally {
        await closeDB();
      }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

