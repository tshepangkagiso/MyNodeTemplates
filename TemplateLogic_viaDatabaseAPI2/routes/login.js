const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkNotAuthenticated } = require('../middleware');

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;
