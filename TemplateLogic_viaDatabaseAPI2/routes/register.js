const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sql = require('mssql/msnodesqlv8');
const { connectToDB, closeDB } = require('../database/dbConfig');
const { checkNotAuthenticated } = require('../middleware');

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

router.post('/', checkNotAuthenticated, async (req, res) => {
    try {
        await connectToDB();

        const password = await bcrypt.hash(req.body.password, 10);
        const name = req.body.name;
        const email = req.body.email;

        const request = new sql.Request();
        const query = `
            INSERT INTO UserDetails (userName, userEmail, userPassword)
            VALUES (@UserName, @UserEmail, @UserPassword)
        `;

        request.input('UserName', sql.VarChar(100), name);
        request.input('UserEmail', sql.VarChar(200), email);
        request.input('UserPassword', sql.VarChar(1000), password);

        try {
            const result = await request.query(query);
            res.redirect('/login');
            console.log('Registration successful');
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        } finally {
            await closeDB();
        }
    } catch {
        res.redirect('/register');
        console.log('Registration failed');
    }
});

module.exports = router;
