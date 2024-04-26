require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// Data
const posts = [
    {
        username: 'Kyle',
        title: 'Post 1',
    },
    {
        username: 'John',
        title: 'Post 2',
    },
    {
        username: 'Steven',
        title: 'Post 3',
    },
];

let refreshTokens = [];
let accessTokens = [];

// Middleware
app.use(express.json());

// API Logic

// Function to generate an access token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Function to generate a refresh token
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

// Login endpoint
app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {
        name: username,
    };

    const accessToken = generateAccessToken(user);
    if (accessTokens.length === 1) {
        accessTokens.length = 0;
        accessTokens.push(accessToken);
    }

    const refreshToken = generateRefreshToken(user);
    if (refreshTokens.length === 0) {
        refreshTokens.push(refreshToken);
        authRefreshToken(refreshToken, res); // Pass the response object to the function
    }

    res.json({ accessToken: accessTokens[0], refreshToken: refreshTokens[0]});
});

// Logout endpoint
app.delete('/logout', (req, res) => {
    const refreshToken = refreshTokens[0];
    if (refreshToken !== null) {
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        refreshTokens.length = 0;
        accessTokens.length =0;
        res.sendStatus(204).json('Logout sucessful');
    } else {
        refreshTokens.length = 0;
        accessTokens.length =0;
        res.sendStatus(400).json('Logout failed' );
    }

    refreshTokens.length = 0;
    accessTokens.length =0;
});

// Posts endpoint with authentication middleware
app.get('/posts', authenticateToken, (req, res) => {
    const loginUser = posts.filter((post) => post.username === req.user.name);
    res.json(loginUser);
});

// Middleware function to authenticate tokens
function authenticateToken(req, res, next) {
        // get token sent to use and then verify if its the correct user.
        const token = accessTokens[0];
        if(token == null) return res.sendStatus(401)
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) return res.sendStatus(403)
            req.user = user
            next();
        })
}

// Function to authenticate a refresh token and issue a new access token
function authRefreshToken(refreshToken, res) {
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        accessTokens.push(accessToken);
        res.json({ accessToken: accessToken });
    });
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

