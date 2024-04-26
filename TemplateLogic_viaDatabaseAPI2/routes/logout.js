const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware');

router.get('/', checkAuthenticated, (req, res) => {
    const userName = req.user.userName;
    console.log(`username: ${userName}`)
    res.render('index.ejs', { name: userName });
});

router.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
