'use strict';
//Dependencies
const express = require('express') , app = express();
const cors = require('cors');
const body_parser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const port = process.env.PORT || 3000;
const { connectToDB,  closeDB } = require('./database/db');

//Middleware
app.use(cors());
app.use(body_parser.json());
app.use(express.json());
app.use(express.static('public'));

//API Logic
app.get('/home', async (req,res)=>{
    //read logic http://localhost:3000/home
    try {
        await connectToDB();
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Clients');
        let allClients = result.recordset
        res.json(allClients);
      } catch (err) {
        console.error('Error retrieving clients:', err);
        res.status(500).json({ error: 'An error occurred while retrieving clients' });
      } finally {
        await closeDB();
      }
});






app.listen(port, () =>{
    console.log(`server running on port: ${port}`);
});